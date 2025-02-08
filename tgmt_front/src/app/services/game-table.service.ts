// src/app/services/game-table.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameTableService {
  private baseUrl = 'http://localhost:3000/api/tables'; // URL de base pour les tables

  constructor(private http: HttpClient) { }

    //Pour la méthode créate, presente dans le GameService

  // Méthode pour supprimer une table de jeu
  deleteTable(tableId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${tableId}`, this.getHttpOptions());
  }

   // Nouvelle méthode pour rejoindre une table
   joinTable(tableId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${tableId}/join`, {}, this.getHttpOptions());
  }

  // Nouvelle méthode pour quitter une table
  leaveTable(tableId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${tableId}/leave`, {}, this.getHttpOptions());
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
