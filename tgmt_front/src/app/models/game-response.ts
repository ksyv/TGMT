// src/app/models/game-response.ts
import { Game } from './game';

export interface GameResponse {
  status: number;
  message: string;
  result: Game;
}
