import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service';
import { Game } from '../../../models/game';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-single-game', // Selector for using the component in templates.
  templateUrl: './single-game.component.html', // Path to the component's HTML template.
  styleUrls: ['./single-game.component.css'] // Path to the component's CSS styles.
})
export class SingleGameComponent implements OnInit {
  game: Game | undefined; // Holds the game data.
  isAdmin: boolean = false; // Indicates if the current user is an admin.
  userId: string = ''; // Stores the current user's ID.
  isInFavorites: boolean = false; // Indicates if the game is in the user's favorites.

  // Constructor to inject required services.
  constructor(
    private route: ActivatedRoute, // Service to access route parameters.
    private router: Router, // Service for programmatic navigation.
    private gameService: GameService, // Service to interact with the game API.
    private authService: AuthService, // Service to handle authentication and user roles.
    private sanitizer: DomSanitizer // Service to sanitize HTML content.
  ) { }

  // Initializes the component.
  ngOnInit(): void {
    // Retrieves the game ID from route parameters.
    const gameId = this.route.snapshot.paramMap.get('id');

    // Loads game details if a game ID is provided.
    if (gameId) {
      this.loadGameDetails(gameId);
    } else {
      console.error('No game ID provided');
    }

    // Checks if the current user is an admin.
    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin');
    });

    // Retrieves the current user's ID and checks if the game is a favorite.
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

  // Loads the game details from the GameService.
  loadGameDetails(gameId: string): void {
    this.gameService.getGameById(gameId).subscribe(
      response => {
        this.game = response.result; // Assuming the game data is in the 'result' property.
        if (this.userId) {
          this.checkFavoriteStatus();
        }
      },
      error => {
        console.error('Error fetching game details:', error);
      }
    );
  }

  // Checks if the game is in the user's favorites.
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

  // Adds the game to the user's favorites.
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

  // Removes the game from the user's favorites.
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

  // Returns a sanitized version of the game description to prevent XSS attacks.
  getSafeDescription(): SafeHtml | string {
    if (this.game && this.game.description) {
      return this.sanitizer.bypassSecurityTrustHtml(this.game.description);
    }
    return '';
  }

  // Navigates to the game update page.
  goToUpdatePage(): void {
    if (this.game && this.game._id) {
      this.router.navigate(['/games', this.game._id, 'update']);
    }
  }

  // Deletes the game.
  deleteGame(): void {
    if (this.game) {
      this.gameService.deleteGame(this.game._id)
        .subscribe(
          () => {
            console.log('Game deleted successfully');
            this.router.navigate(['/gamecard']); // Navigates to the game list page after deletion.
          },
          error => {
            console.error('Error deleting game:', error);
          }
        );
    }
  }
}
