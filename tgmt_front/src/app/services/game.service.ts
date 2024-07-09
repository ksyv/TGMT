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
    const url = `${this.baseUrl}/${game._id}`; // Assure-toi que ton modèle Game a un champ _id pour l'identifiant
    return this.http.put<Game>(url, game);
  }

  deleteGame(gameId: string): Observable<any> {
    const url = `${this.baseUrl}/${gameId}`;
    return this.http.delete(url);
  }
}
