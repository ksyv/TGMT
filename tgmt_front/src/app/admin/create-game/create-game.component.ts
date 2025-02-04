import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-create-game', // Selector used to identify the component in templates.
  templateUrl: './create-game.component.html', // Path to the component's HTML template.
  styleUrls: ['./create-game.component.css'] // Path to the component's CSS styles.
})
export class CreateGameComponent implements OnInit {
  createGameForm: FormGroup; // Form group to manage the form data.
  successMessage: string | null = null; // Variable to store the success message.
  errorMessage: string | null = null; // Variable to store the error message.

  // Constructor to inject required services and initialize the form.
  constructor(
    private fb: FormBuilder, // Service to create form groups and controls.
    private gameService: GameService, // Service to interact with the game API.
    private router: Router // Service to handle navigation.
  ) {
    // Initializes the form group with form controls and validators.
    this.createGameForm = this.fb.group({
      name: ['', Validators.required], // Form control for the game name, which is required.
      type: ['', Validators.required], // Form control for the game type, which is required.
      category: ['', Validators.required], // Form control for the game category, which is required.
      ageMin: ['', [Validators.required, Validators.min(0)]], // Form control for the minimum age, which is required and must be at least 0.
      difficulty: ['', Validators.required], // Form control for the game difficulty, which is required.
      author: ['', Validators.required], // Form control for the game author, which is required.
      playerMin: ['', [Validators.required, Validators.min(1)]], // Form control for the minimum number of players, which is required and must be at least 1.
      playerMax: ['', [Validators.required, Validators.min(1)]], // Form control for the maximum number of players, which is required and must be at least 1.
      description: ['', Validators.required], // Form control for the game description, which is required.
      image: [null, Validators.required], // Form control for the game image, which is required.
      partytime: ['', [Validators.required, Validators.min(1)]], // Form control for the game party time, which is required and must be at least 1.
      rules: ['', Validators.required], // Form control for the game rules, which is required.
      resourcesLink: [[]], // Form control for the game resources links, initialized as an empty array.
    });
  }

  // ngOnInit lifecycle hook, currently not used in this component.
  ngOnInit(): void {}

  // Method to handle file selection changes.
  onFileChange(event: any): void {
    const file = event.target.files[0]; // Retrieves the first selected file.
    if (file) {
      // Updates the 'image' form control with the selected file.
      this.createGameForm.patchValue({
        image: file
      });
    }
  }

  // Method to handle form submission.
  onSubmit(): void {
    // Checks if the form is valid.
    if (this.createGameForm.valid) {
      // Creates a FormData object to hold the form data.
      const formData = new FormData();
      // Appends each form control's value to the FormData object.
      Object.keys(this.createGameForm.controls).forEach(key => {
        formData.append(key, this.createGameForm.get(key)?.value);
      });

      // Calls the game service to create the game and subscribes to the response.
      this.gameService.createGame(formData).subscribe(
        response => {
          // If the game is created successfully, displays a success message.
          this.successMessage = 'Jeu créé avec succes!';
          this.errorMessage = null; // Clears any previous error message.
          this.createGameForm.reset(); // Resets the form.
          // Optionally, navigate to another page
          // this.router.navigate(['/admin/dashboard']);
        },
        error => {
          // If an error occurs during game creation, displays an error message.
          this.successMessage = null; // Clears any previous success message.
          this.errorMessage = 'Erreur dans la création du jeu, essayez encore.';
        }
      );
    }
  }
}
