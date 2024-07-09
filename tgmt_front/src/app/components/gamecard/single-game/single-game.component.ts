import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { Game } from '../../../models/game';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {
  game: Game | undefined;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');

    if (gameId) {
      this.gameService.getGameById(gameId)
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

    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin');
    });
  }

  goToUpdatePage(): void {
    if (this.game && this.game._id) {
      this.router.navigate(['/games', this.game._id, 'update']);
    }
  }
  deleteGame(): void {
    if (this.game) {
      // Appelle le service pour supprimer le jeu
      this.gameService.deleteGame(this.game._id).subscribe(
        response => {
          console.log('Jeu supprimé avec succès:', response);
          // Peut-être afficher un message de succès ou rediriger l'utilisateur
        },
        error => {
          console.error('Erreur lors de la suppression du jeu:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}

