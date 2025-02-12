import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/users'; // Déclaration de la propriété apiUrl
  public roleSubject = new BehaviorSubject<string | null>(null); // Correction du type pour accepter null
  role$ = this.roleSubject.asObservable();

  public userIdSubject = new BehaviorSubject<string | null>(null); // Correction du type pour accepter null
  userId$ = this.userIdSubject.asObservable();

  errorMessage: string = '';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {
    this.initializeLocalStorage();
    this.loadUserRole();
  }

  private initializeLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      }
    }
  }

  private loadUserRole() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.getUserInfo().subscribe(
          user => {
            if (user && user.role) {
              this.roleSubject.next(user.role);
              this.userIdSubject.next(user._id);
            }
          },
          error => {
            console.error('Error loading user role:', error);
          }
        );
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    this.errorMessage = '';

    return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token && response.role) {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(this.tokenKey, response.token);
            }
            this.roleSubject.next(response.role);
            this.userIdSubject.next(response.userId);
            // Redirection automatique vers admin/dashboard si l'utilisateur est un admin
            if (response.role === 'admin') {
              this.router.navigateByUrl('/admin/dashboard');
            } else {
              this.router.navigateByUrl('/dashboard'); // Redirection pour les utilisateurs normaux
            }
          }
        }),
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer plus tard.';
          }
          return throwError(error);
        })
      );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey); // Supprimer le token du localStorage
    }
    this.roleSubject.next(null); // Réinitialiser le BehaviorSubject du rôle
    this.userIdSubject.next(null); // Réinitialiser le BehaviorSubject de l'ID utilisateur
    this.router.navigateByUrl('/sign-in'); // Rediriger vers la page de connexion
  }

  getRole(): Observable<string | null> { // Retourne maintenant Observable<string | null>
    return this.role$;
  }

  getUserId(): Observable<string | null> { // Retourne maintenant Observable<string | null>
    return this.userId$;
  }

  updateUserInfo(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/current`, user, this.getHttpOptions())
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la mise à jour des informations. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/current`, this.getHttpOptions())
      .pipe(
        tap(response => {
          if (response && response.role) {
            this.roleSubject.next(response.role); // Mettre à jour le BehaviorSubject avec le rôle
          }
        }),
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la récupération des informations utilisateur. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    return this.http.post<any>(url, { email })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Erreur lors de la récupération du mot de passe. Veuillez réessayer plus tard.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          return throwError(errorMessage);
        })
      );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/reset-password/${token}`;
    return this.http.post(url, { newPassword });
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, this.getHttpOptions()).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors de la suppression du compte. Veuillez réessayer plus tard.';
        return throwError(error);
      }),
      tap(() => {
        // Supprimer les informations de l'utilisateur du localStorage SEULEMENT APRES la suppression
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('role');

        // Réinitialiser l'état de l'utilisateur dans le service
        this.userIdSubject.next(null);
        this.roleSubject.next(null);

        // Rediriger vers la page de connexion
        this.router.navigate(['/sign-in']);
      })
    );
  }

  private getHttpOptions() {
    const token = (typeof localStorage !== 'undefined') ? localStorage.getItem(this.tokenKey) : '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return { headers };
  }
}
