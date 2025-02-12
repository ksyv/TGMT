import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, this.getHttpOptions());
  }

  updateUserRole(userId: string, newRole: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/update-role`, { role: newRole }, this.getHttpOptions());
  }

  // Nouvelle méthode pour la recherche d'utilisateurs
  searchUsers(searchTerm: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?term=${searchTerm}`, this.getHttpOptions());
  }

  deleteUser(userId: string): Observable<any> {
    const url = userId ? `${this.apiUrl}/delete/${userId}` : `${this.apiUrl}/delete`;
    return this.http.delete(url, this.getHttpOptions());
  }
  private getHttpOptions() {
    const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('access_token') : '';
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    });
    return { headers };
}
}
