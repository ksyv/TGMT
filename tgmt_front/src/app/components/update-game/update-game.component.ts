import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { FormBuilder, FormGroup } from '@angular/forms';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-update-game', // Selector for using the component in templates.
  templateUrl: './update-game.component.html', // Path to the component's HTML template.
  styleUrls: ['./update-game.component.css'] // Path to the component's CSS styles.
})
export class UpdateGameComponent implements OnInit {
  gameId: string = ''; // Stores the ID of the game being updated.
  game: Game | undefined; // Stores the game data.
  gameForm: FormGroup; // Form group to manage the form data for updating the game.

  // Constructor to inject required services.
  constructor(
    private route: ActivatedRoute, // Service to access route parameters.
    private router: Router, // Service for programmatic navigation.
    private gameService: GameService, // Service to interact with the game API.
    private fb: FormBuilder // Service to create form groups and controls.
  ) {
    // Retrieves the game ID from route parameters.
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
    // Initializes the form group with empty form controls.
    this.gameForm = this.fb.group({
      name: [''],
      type: [''],
      category: [''],
      ageMin: [''],
      difficulty: [''],
      author: [''],
      playerMin: [''],
      playerMax: [''],
      description: [''],
      image: [''],
      partytime: [''],
      rules: ['']
    });
  }

  // Initializes the component.
  ngOnInit(): void {
    if (this.gameId) {
      // Fetches the game details if a game ID is provided.
      this.gameService.getGameById(this.gameId)
        .subscribe(
          response => {
            this.game = response.result; // Assigns the fetched game data to 'game' variable.
            this.populateForm(); // Populates the form with the fetched game data.
          },
          error => {
            console.error('Error fetching game details:', error); // Logs an error message if fetching game details fails.
          }
        );
    } else {
      console.error('No game ID provided'); // Logs an error message if no game ID is provided.
    }
  }

  // Populates the form with game data.
  populateForm(): void {
    if (this.game) {
      // Updates the form controls with the game data.
      this.gameForm.patchValue({
        name: this.game.name,
        type: this.game.type,
        category: this.game.category,
        ageMin: this.game.ageMin,
        difficulty: this.game.difficulty,
        author: this.game.author,
        playerMin: this.game.playerMin,
        playerMax: this.game.playerMax,
        description: this.game.description,
        partytime: this.game.partytime,
        rules: this.game.rules,
        image: this.game.image // Sets the image URL in the form.
      });
    }
  }

  // Handles file selection changes.
  onFileChange(event: any): void {
    const file = event.target.files[0]; // Retrieves the first selected file.
    if (file) {
      // Updates the 'image' form control with the selected file.
      this.gameForm.patchValue({
        image: file
      });
    }
  }

  // Updates the game data.
  updateGame(): void {
    if (this.gameForm.valid) {
      // Creates a new object with updated game data.
      const updatedGame = { ...this.game, ...this.gameForm.value };

      // Calls the GameService to update the game.
      this.gameService.updateGame(updatedGame).subscribe(
        response => {
          console.log('Jeu mis à jour avec succès:', response); // Logs a success message.
          this.router.navigate(['/single-game', this.gameId]); // Navigates to the game details page.
        },
        error => {
          console.error('Erreur lors de la mise à jour du jeu:', error); // Logs an error message.
        }
      );
    }
  }
}
