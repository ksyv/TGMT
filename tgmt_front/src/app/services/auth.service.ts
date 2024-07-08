import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public roleSubject = new BehaviorSubject<string>('');
  role$ = this.roleSubject.asObservable();

  public userIdSubject = new BehaviorSubject<string>('');
  userId$ = this.userIdSubject.asObservable();

  errorMessage: string = '';
  private tokenKey = 'token';

  constructor(private http: HttpClient, private router: Router) {
    // Initialize localStorage when the service is constructed
    this.initializeLocalStorage();
  }

  private initializeLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        localStorage.setItem(this.tokenKey, token);
      }
    }
  }

  login(email: string, password: string): Observable<any> {
    this.errorMessage = '';

    return this.http.post<any>('http://localhost:3000/users/login', { email, password })
      .pipe(
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
    localStorage.removeItem(this.tokenKey); // Supprime le token du localStorage
    this.roleSubject.next(''); // Réinitialise le sujet du rôle
    this.userIdSubject.next(''); // Réinitialise le sujet de l'ID utilisateur
    this.router.navigate(['/sign-in']); // Redirige vers la page de connexion
  }

  getRole() {
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
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la récupération des informations utilisateur. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    const url = 'http://localhost:3000/users/forgot-password'; // Endpoint pour la récupération de mot de passe
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
    const token = localStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    });
    return { headers };
  }
}
