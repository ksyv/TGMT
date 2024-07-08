import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private baseUrl = 'http://localhost:3000/api/games'; // Assurez-vous d'utiliser votre URL backend correcte

  constructor(private http: HttpClient) { }

  // Récupérer tous les jeux
  getGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.baseUrl}`);
  }

  // Récupérer un jeu par son ID
  getGameById(id: string): Observable<Game> {
    return this.http.get<Game>(`${this.baseUrl}/${id}`);
  }
}
