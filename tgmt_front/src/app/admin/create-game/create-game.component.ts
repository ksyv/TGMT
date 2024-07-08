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
      image: ['', Validators.required],
      partytime: ['', [Validators.required, Validators.min(1)]],
      rules: ['', Validators.required],
      resourcesLink: this.fb.array([]),
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.createGameForm.valid) {
      this.gameService.createGame(this.createGameForm.value).subscribe(
        response => {
          console.log('Game created successfully:', response);
          this.router.navigate(['/admin/dashboard']);
        },
        error => {
          console.error('Error creating game:', error);
        }
      );
    }
  }
}
