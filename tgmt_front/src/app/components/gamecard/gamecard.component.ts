import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service'; // Assurez-vous d'importer votre service de jeu

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.css']
})
export class GamecardComponent implements OnInit {
  games: any[] = []; // Assurez-vous de définir le type correct ici
  searchParams = {
    name: '',
    type: '',
    category: '',
    ageMin: null,
    difficulty: '',
    author: '',
    playerMin: null,
    playerMax: null,
    partytime: null
  };

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.fetchGames(); // Appelez la méthode pour récupérer les jeux lors de l'initialisation
  }

  fetchGames() {
    this.gameService.getGames().subscribe(
      (data: any) => {
        this.games = data.result; // Assurez-vous que votre backend renvoie les jeux dans 'data.result'
      },
      (error: any) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  searchGames() {
    this.gameService.searchGames(this.searchParams).subscribe(
      (data: any) => {
        this.games = data.result;
      },
      (error: any) => {
        console.error('Error searching games:', error);
      }
    );
  }
}
