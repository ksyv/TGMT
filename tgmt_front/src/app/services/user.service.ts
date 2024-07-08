import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // Importer AuthService
import { switchMap } from 'rxjs/operators'; // Importer switchMap pour transformer l'observable

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users'; // Remplacez par votre URL backend

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserInfo(): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        return this.http.get<any>(`${this.apiUrl}/userinfo/${userId}`);
      })
    );
  }

  updateUserInfo(userInfo: any): Observable<any> {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        return this.http.put<any>(`${this.apiUrl}/userinfo/${userId}`, userInfo);
      })
    );
  }
}
