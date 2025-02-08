// src/app/services/game.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { GameResponse } from '../models/game-response';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = 'http://localhost:3000/api/games';
  private tableUrl = 'http://localhost:3000/api/tables'; // URL pour les tables de jeu

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.baseUrl}`);
  }

  searchGames(params: any): Observable<Game[]> {
    let httpParams = new HttpParams();
    for (let key in params) {
      if (params[key]) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get<Game[]>(`${this.baseUrl}/search`, { params: httpParams });
  }

  getGameById(id: string): Observable<GameResponse> {
    return this.http.get<GameResponse>(`${this.baseUrl}/${id}`);
  }

  createGame(gameData: FormData): Observable<Game> {
    return this.http.post<Game>(`${this.baseUrl}`, gameData);
  }

  updateGame(game: Game): Observable<Game> {
    const url = `${this.baseUrl}/${game._id}`;
    return this.http.put<Game>(url, game);
  }

  deleteGame(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/${gameId}`;
    return this.http.delete(url);
  }

  addToFavorites(data: { userId: string, gameId: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/favorites/add-to-favorites`, data);
  }

  removeFavorite(data: { userId: string, gameId: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/favorites/remove-from-favorites`, data);
  }

  getFavorites(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:3000/api/favorites/${userId}`);
  }

  isFavorite(data: { userId: string, gameId: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/api/favorites/is-favorite`, data);
  }

  createGameTable(tableData: any): Observable<any> {
    return this.http.post<any>(`${this.tableUrl}`, tableData, this.getHttpOptions());
  }

  // Ajoute cette méthode pour récupérer les tables par ID de jeu
  getTablesByGameId(gameId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.tableUrl}?gameId=${gameId}`);
  }

  private getHttpOptions() {
      const token = (typeof localStorage !== 'undefined') ? localStorage.getItem('access_token') : ''; //Utilisation de access_token
      const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
      });
      return { headers };
  }
}
