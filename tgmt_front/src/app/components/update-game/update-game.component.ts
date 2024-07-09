import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.component.html',
  styleUrls: ['./update-game.component.css']
})
export class UpdateGameComponent implements OnInit {
  gameId: string = '';
  game: Game | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    if (this.gameId) {
      this.gameService.getGameById(this.gameId)
        .subscribe(
          response => {
            this.game = response.result;
          },
          error => {
            console.error('Error fetching game details:', error);
          }
        );
    } else {
      console.error('No game ID provided');
    }
  }

  updateGame(): void {
    if (this.game) {
      this.gameService.updateGame(this.game).subscribe(
        response => {
          console.log('Jeu mis à jour avec succès:', response);
          // Naviguer vers la page de détails du jeu après la mise à jour
          this.router.navigate(['/single-game', this.gameId]); // Assure-toi que '/games' correspond à ta route de détails de jeu
        },
        error => {
          console.error('Erreur lors de la mise à jour du jeu:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}
