import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public roleSubject = new BehaviorSubject<string>(''); // Changement à public
  role$ = this.roleSubject.asObservable();

  public userIdSubject = new BehaviorSubject<string>(''); // Changement à public
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
              // Redirection automatique vers admin/dashboard si l'utilisateur est un admin
              if (user.role === 'admin') {
                this.router.navigateByUrl('/admin/dashboard');
              }
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

    return this.http.post<any>('http://localhost:3000/users/login', { email, password })
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
    this.roleSubject.next(''); // Réinitialiser le BehaviorSubject du rôle
    this.userIdSubject.next(''); // Réinitialiser le BehaviorSubject de l'ID utilisateur
    this.router.navigateByUrl('/sign-in'); // Rediriger vers la page de connexion
  }

  getRole(): Observable<string> {
    return this.role$; 
  }

  getUserId() {
    return this.userId$;
  }

  updateUserInfo(user: any): Observable<any> {
    return this.http.put<any>('http://localhost:3000/users/current', user, this.getHttpOptions())
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la mise à jour des informations. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users/current', this.getHttpOptions())
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
    const url = 'http://localhost:3000/users/forgot-password';
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
    const url = `http://localhost:3000/users/reset-password/${token}`;
    return this.http.post(url, { newPassword });
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
