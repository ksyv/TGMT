import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users'; // Assurez-vous que l'URL correspond à votre backend

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user._id}`, user);
  }

  // Nouvelle méthode pour mettre à jour le rôle de l'utilisateur
  updateUserRole(userId: string, newRole: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/update-role`, { role: newRole });
  }
}
