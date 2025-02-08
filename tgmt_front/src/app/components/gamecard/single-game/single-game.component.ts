import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { GameTableService } from '../../../services/game-table.service';
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
  tables: any[] = [];
  isUserRegistered: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private gameTableService: GameTableService
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
    console.log("loadTables called with gameId:", gameId); // AJOUTE
    this.gameService.getTablesByGameId(gameId).subscribe({
      next: (tables: any) => {
        console.log("Tables received:", tables); // AJOUTE
        this.tables = tables;
      },
      error: (error) => {
        console.error('Error fetching tables:', error);
      }
    });
  }

  // Nouvelle méthode pour vérifier si l'utilisateur est inscrit à une table donnée
  isUserRegisteredToTable(table: any): boolean {
    return table.participants.some((participant: any) => participant._id === this.userId);
}

// Nouvelle méthode pour s'inscrire à une table
joinTable(tableId: string): void {
  if (!this.userId) {
      console.error("User ID is not available. Cannot join table.");
      return; // Ou afficher un message/redirection pour se connecter
    }
    this.gameTableService.joinTable(tableId).subscribe({
        next: () => {
            console.log('Successfully joined table');
            this.loadTables(this.game!._id); // Recharge les tables pour mettre à jour l'affichage
        },
        error: (error) => {
            console.error('Error joining table:', error);
        }
    });
}

// Nouvelle méthode pour se désinscrire d'une table
leaveTable(tableId: string): void {
  if (!this.userId) {
      console.error("User ID is not available. Cannot leave table.");
      return; // Ou afficher un message/redirection pour se connecter
    }
    this.gameTableService.leaveTable(tableId).subscribe({
        next: () => {
            console.log('Successfully left table');
            this.loadTables(this.game!._id); // Recharge les tables pour mettre à jour l'affichage
        },
        error: (error) => {
            console.error('Error leaving table:', error);
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

    deleteTable(tableId: string): void {
      console.log("deleteTable called with tableId:", tableId); // AJOUTE
      if (confirm('Êtes-vous sûr de vouloir supprimer cette table de jeu ?')) {
          this.gameTableService.deleteTable(tableId).subscribe({
              next: () => {
                  console.log('Table supprimée avec succès');
                  // Recharger les tables après la suppression
                  const gameId = this.route.snapshot.paramMap.get('id');
                  if (gameId) {
                      this.loadTables(gameId);
                  }
              },
              error: (error: any) => {
                  console.error('Erreur lors de la suppression de la table:', error);
              }
          });
      }
  }
}
