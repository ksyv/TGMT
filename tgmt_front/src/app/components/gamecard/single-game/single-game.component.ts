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
  isInFavorites: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');

    if (gameId) {
      this.loadGameDetails(gameId);
    } else {
      console.error('No game ID provided');
    }

    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin');
    });

    this.authService.getUserId().subscribe(
      userId => {
        this.userId = userId || '';
        if (this.game) {
          this.checkFavoriteStatus();
        }
      },
      error => {
        console.error('Error fetching user ID:', error);
      }
    );
  }

  loadGameDetails(gameId: string): void {
    this.gameService.getGameById(gameId).subscribe(
      response => {
        this.game = response.result;
        if (this.userId) {
          this.checkFavoriteStatus();
        }
      },
      error => {
        console.error('Error fetching game details:', error);
      }
    );
  }

  checkFavoriteStatus(): void {
    if (this.game && this.userId) {
      this.gameService.isFavorite({ userId: this.userId, gameId: this.game._id }).subscribe(
        (response: any) => {
          this.isInFavorites = response.isFavorite;
        },
        (error: any) => {
          console.error('Error checking favorite status:', error);
        }
      );
    }
  }

  addToFavorites(): void {
    if (this.game && this.game._id && this.userId) {
      if (this.isInFavorites) {
        alert('Ce jeu est déjà dans vos favoris.');
      } else {
        const gameId = this.game._id;
        const userId = this.userId;

        this.gameService.addToFavorites({ userId, gameId }).subscribe(
          response => {
            console.log('Game added to favorites:', response);
            this.isInFavorites = true;
          },
          error => {
            console.error('Error adding game to favorites:', error);
          }
        );
      }
    }
  }

  removeFromFavorites(): void {
    if (this.game && this.game._id && this.userId) {
      if (!this.isInFavorites) {
        alert('Ce jeu n\'est pas actuellement dans vos favoris.');
      } else {
        const gameId = this.game._id;
        const userId = this.userId;

        this.gameService.removeFavorite({ userId, gameId }).subscribe(
          response => {
            console.log('Game removed from favorites:', response);
            this.isInFavorites = false;
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
      this.gameService.deleteGame(this.game._id)
        .subscribe(
          () => {
            console.log('Game deleted successfully');
            // Redirigez l'utilisateur vers une autre page ou mettez à jour la liste de jeux, etc.
            this.router.navigate(['/gamecard']); // Exemple de redirection vers la liste des jeux
          },
          error => {
            console.error('Error deleting game:', error);
            // Gérez l'erreur ici (par exemple, affichez un message à l'utilisateur)
          }
        );
    }
  }

}

