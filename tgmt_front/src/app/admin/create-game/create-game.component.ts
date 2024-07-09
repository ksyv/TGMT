// src/app/admin/create-game/create-game.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
  createGameForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router
  ) {
    this.createGameForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      category: ['', Validators.required],
      ageMin: ['', [Validators.required, Validators.min(0)]],
      difficulty: ['', Validators.required],
      author: ['', Validators.required],
      playerMin: ['', [Validators.required, Validators.min(1)]],
      playerMax: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required],
      image: [null, Validators.required],
      partytime: ['', [Validators.required, Validators.min(1)]],
      rules: ['', Validators.required],
      resourcesLink: [[]],
    });
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.createGameForm.patchValue({
        image: file
      });
    }
  }

  onSubmit(): void {
    if (this.createGameForm.valid) {
      const formData = new FormData();
      Object.keys(this.createGameForm.controls).forEach(key => {
        formData.append(key, this.createGameForm.get(key)?.value);
      });

      this.gameService.createGame(formData).subscribe(
        response => {
          this.successMessage = 'Jeu créé avec succes!';
          this.errorMessage = null;
          this.createGameForm.reset();
          // Optionally, navigate to another page
          // this.router.navigate(['/admin/dashboard']);
        },
        error => {
          this.successMessage = null;
          this.errorMessage = 'Erreur dans la création du jeu, essayez encore.';
        }
      );
    }
  }
}
