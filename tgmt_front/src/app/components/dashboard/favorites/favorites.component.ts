import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GameService } from '../../../services/game.service';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-favorites', // Selector for using the component in templates.
  templateUrl: './favorites.component.html', // Path to the component's HTML template.
  styleUrls: ['./favorites.component.css'] // Path to the component's CSS styles.
})
export class FavoritesComponent implements OnInit {
  favoriteGames: any[] = []; // Array to store the user's favorite games.
  userId: string = ''; // Variable to store the user ID.

  // Constructor to inject required services.
  constructor(
    private authService: AuthService, // Service to handle authentication and user roles.
    private gameService: GameService // Service to interact with the game API.
  ) {}

  // Initializes the component and retrieves the user's favorite games.
  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
      this.loadFavorites();
    });
  }

  // Loads the user's favorite games from the GameService.
  loadFavorites(): void {
    if (this.userId) {
      this.gameService.getFavorites(this.userId).subscribe(
        favorites => {
          this.favoriteGames = favorites; // Assigns the fetched favorite games to 'favoriteGames' array.
        },
        error => {
          console.error('Error fetching favorite games:', error); // Logs an error message if fetching fails.
        }
      );
    }
  }
}
