import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameService } from '../../services/game.service';
import { Game } from '../../models/game';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-game',
  templateUrl: './update-game.component.html',
  styleUrls: ['./update-game.component.css']
})
export class UpdateGameComponent implements OnInit {
  gameId: string = '';
  game: Game | undefined;
  gameForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameService: GameService,
    private fb: FormBuilder
  ) {
    this.gameId = this.route.snapshot.paramMap.get('id') || '';
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

  ngOnInit(): void {
    if (this.gameId) {
      this.gameService.getGameById(this.gameId)
        .subscribe(
          response => {
            this.game = response.result;
            this.populateForm();
          },
          error => {
            console.error('Error fetching game details:', error);
          }
        );
    } else {
      console.error('No game ID provided');
    }
  }

  populateForm(): void {
    if (this.game) {
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
        image: this.game.image // Pré-remplir l'image dans le formulaire
      });
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.gameForm.patchValue({
        image: file
      });
    }
  }

  updateGame(): void {
    if (this.gameForm.valid) {
      const updatedGame = { ...this.game, ...this.gameForm.value };

      this.gameService.updateGame(updatedGame).subscribe(
        response => {
          console.log('Jeu mis à jour avec succès:', response);
          this.router.navigate(['/single-game', this.gameId]);
        },
        error => {
          console.error('Erreur lors de la mise à jour du jeu:', error);
        }
      );
    }
  }
}
