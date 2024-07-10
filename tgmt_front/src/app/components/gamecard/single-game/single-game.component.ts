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
  userId: string = '';

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

    // Abonnement à userId pour obtenir l'ID de l'utilisateur
    this.authService.getUserId().subscribe(
      userId => {
        this.userId = userId;
      },
      error => {
        console.error('Error fetching user ID:', error);
      }
    );
  }

  toggleFavorite() {
    if (this.game && this.game._id && this.userId) {
      const gameId = this.game._id;
      const userId = this.userId;

      const isFavorite = !this.game.isFavorite; // Inverse l'état actuel

      if (isFavorite) {
        this.gameService.addToFavorites({ userId, gameId }).subscribe(
          response => {
            console.log('Game added to favorites:', response);
            if (this.game) { // Vérification supplémentaire pour éviter l'erreur `2532`
              this.game.isFavorite = true; // Mettre à jour l'état local du jeu
            }
          },
          error => {
            console.error('Error adding game to favorites:', error);
          }
        );
      } else {
        this.gameService.removeFavorite({ userId, gameId }).subscribe(
          response => {
            console.log('Game removed from favorites:', response);
            if (this.game) { // Vérification supplémentaire pour éviter l'erreur `2532`
              this.game.isFavorite = false; // Mettre à jour l'état local du jeu
            }
          },
          error => {
            console.error('Error removing game from favorites:', error);
          }
        );
      }
    }
  }

  goToUpdatePage(): void {
    if (this.game && this.game._id) {
      this.router.navigate(['/games', this.game._id, 'update']);
    }
  }

  deleteGame(): void {
    if (this.game) {
      // Logique pour supprimer le jeu
    }
  }

}

