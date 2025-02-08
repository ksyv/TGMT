import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { Game } from '../../../models/game';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    isLoggedIn: boolean = false;
    tables: any[] = []; // Ajoute cette ligne pour stocker les tables

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');

    if (gameId) {
      this.loadGameDetails(gameId);
      this.loadTables(gameId); // Ajoute cet appel pour charger les tables
    } else {
      console.error('No game ID provided');
    }

    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin');
        this.isLoggedIn = !!role;
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

  // Ajoute cette méthode pour charger les tables
    loadTables(gameId: string): void {
        this.gameService.getTablesByGameId(gameId).subscribe({ // Assure-toi d'avoir cette méthode
            next: (tables: any) => {
                this.tables = tables; // Stocke les tables récupérées
            },
            error: (error) => {
                console.error('Error fetching tables:', error);
            }
        });
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

  getSafeDescription(): SafeHtml | string {
    if (this.game && this.game.description) {
      return this.sanitizer.bypassSecurityTrustHtml(this.game.description);
    }
    return '';
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
            this.router.navigate(['/gamecard']);
          },
          error => {
            console.error('Error deleting game:', error);
          }
        );
    }
  }

    openCreateTableForm(): void {
        if (this.game && this.game._id) {
            this.router.navigate(['/create-table', this.game._id]);
        }
    }
}
