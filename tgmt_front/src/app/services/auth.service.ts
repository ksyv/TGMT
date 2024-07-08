import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  constructor(private http: HttpClient, private router: Router) {}

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
    // Actions de déconnexion : vider le token, réinitialiser les sujets, etc.
    localStorage.removeItem('token'); // Exemple de suppression du token JWT du localStorage

    // Réinitialisation des sujets
    this.roleSubject.next('');
    this.userIdSubject.next('');

    // Redirection vers la page de connexion
    this.router.navigate(['/signin']);
  }

  getRole() {
    return this.role$;
  }

  getUserId() {
    return this.userId$;
  }

  updateUserInfo(user: any): Observable<any> {
    return this.http.put<any>('http://localhost:3000/users/current', user)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la mise à jour des informations. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }

  getUserInfo(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/users/current')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorMessage = 'Erreur lors de la récupération des informations utilisateur. Veuillez réessayer plus tard.';
          return throwError(error);
        })
      );
  }
}
