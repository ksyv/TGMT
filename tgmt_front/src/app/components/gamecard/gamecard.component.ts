import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service'; // Import the GameService to interact with game data.

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-gamecard', // Selector for using the component in templates.
  templateUrl: './gamecard.component.html', // Path to the component's HTML template.
  styleUrls: ['./gamecard.component.css'] // Path to the component's CSS styles.
})
export class GamecardComponent implements OnInit {
  games: any[] = []; // Array to store the list of games.
  searchName: string = ''; // Variable to store the search term for game name.
  searchType: string = ''; // Variable to store the search term for game type.
  searchCategory: string = ''; // Variable to store the search term for game category.
  searchAgeMin: number | null = null; // Variable to store the search term for minimum age.
  searchDifficulty: string = ''; // Variable to store the search term for game difficulty.
  searchAuthor: string = ''; // Variable to store the search term for game author.
  searchPlayerMin: number | null = null; // Variable to store the search term for minimum number of players.
  searchPlayerMax: number | null = null; // Variable to store the search term for maximum number of players.
  searchPartytime: number | null = null; // Variable to store the search term for game duration.

  // Constructor to inject the GameService.
  constructor(private gameService: GameService) {}

  // Initializes the component and fetches the list of games.
  ngOnInit(): void {
    this.fetchGames(); // Calls the method to fetch games on component initialization.
  }

  // Fetches the list of games from the GameService.
  fetchGames(): void {
    this.gameService.getGames().subscribe(
      (data: any) => {
        this.games = data.result; // Assigns the fetched games to the 'games' array.
      },
      (error: any) => {
        console.error('Error fetching games:', error); // Logs an error message if fetching games fails.
      }
    );
  }

  // Performs a search based on the entered criteria.
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
        this.games = data.result; // Updates the 'games' array with the search results.
      },
      (error: any) => {
        console.error('Error searching games:', error); // Logs an error message if the search fails.
      }
    );
  }
}
