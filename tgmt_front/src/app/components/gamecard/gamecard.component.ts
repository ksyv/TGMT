import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service'; // Assurez-vous d'importer votre service de jeu

@Component({
  selector: 'app-gamecard',
  templateUrl: './gamecard.component.html',
  styleUrls: ['./gamecard.component.css']
})
export class GamecardComponent implements OnInit {
  games: any[] = []; // Assurez-vous de définir le type correct ici
  searchName: string = '';
  searchType: string = '';
  searchCategory: string = '';
  searchAgeMin: number | null = null;
  searchDifficulty: string = '';
  searchAuthor: string = '';
  searchPlayerMin: number | null = null;
  searchPlayerMax: number | null = null;
  searchPartytime: number | null = null;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.fetchGames(); // Appelez la méthode pour récupérer les jeux lors de l'initialisation
  }

  fetchGames(): void {
    this.gameService.getGames().subscribe(
      (data: any) => {
        this.games = data.result; // Assurez-vous que votre backend renvoie les jeux dans 'data.result'
      },
      (error: any) => {
        console.error('Error fetching games:', error);
      }
    );
  }

  onSearch(): void {
    const searchCriteria = {
      name: this.searchName,
      type: this.searchType,
      category: this.searchCategory,
      ageMin: this.searchAgeMin,
      difficulty: this.searchDifficulty,
      author: this.searchAuthor,
      playerMin: this.searchPlayerMin,
      playerMax: this.searchPlayerMax,
      partytime: this.searchPartytime
    };

    this.gameService.searchGames(searchCriteria).subscribe(
      (data: any) => {
        this.games = data.result; // Mettez à jour la liste des jeux en fonction des résultats de la recherche
      },
      (error: any) => {
        console.error('Error searching games:', error);
      }
    );
  }
}
