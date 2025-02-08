import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GameService } from '../../services/game.service';
import { Router, ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute
import { Game } from '../../models/game';
import { AuthService } from '../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.css'],
  providers: [DatePipe]
})
export class CreateTableComponent implements OnInit {
  createTableForm: FormGroup;
  games: Game[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;
  userId: string | null = null;
  gameId: string | null = null; // Ajoute cette propriété

  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router,
    private route: ActivatedRoute, // Injecte ActivatedRoute
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.createTableForm = this.fb.group({
      game: ['', Validators.required],
      startTime: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      endTime: [{value: '', disabled: true}],
      creator: [''],
    });
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe({
      next: (data: any) => {
        this.games = data.result;
          // Pré-remplit le champ 'game' si gameId est présent
          if (this.gameId) {
            this.createTableForm.patchValue({ game: this.gameId });
          }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des jeux:', error);
        this.errorMessage = "Erreur lors de la récupération des jeux.";
      }
    });

    this.authService.getUserId().subscribe(id => {
      this.userId = id;
      if (this.userId) {
        this.createTableForm.patchValue({ creator: this.userId });
      }
    });

    // Récupération de l'ID du jeu depuis les paramètres de la route
    this.route.paramMap.subscribe(params => {
      this.gameId = params.get('gameId');
      // Pré-remplit le champ 'game' si gameId est présent
      if (this.gameId) {
          this.createTableForm.patchValue({ game: this.gameId });
        }
    });

    this.createTableForm.get('startTime')?.valueChanges.subscribe(() => this.updateEndTime());
    this.createTableForm.get('duration')?.valueChanges.subscribe(() => this.updateEndTime());
  }

  onSubmit() {
    this.successMessage = null;
    this.errorMessage = null;

    if (this.createTableForm.invalid) {
      return;
    }
    const formData = this.createTableForm.getRawValue();
    // Conversion de startTime et endTime en objets Date (si ce ne sont pas déjà des objets Date)
    formData.startTime = new Date(formData.startTime);
    formData.endTime = new Date(formData.endTime);


    // Envoi des données au backend via le service
    this.gameService.createGameTable(formData).subscribe({
      next: (response) => {
        console.log('Table créée avec succès:', response);
        this.successMessage = 'Table de jeu créée avec succès !';
        // Redirection vers la liste des tables, ou la page de détails du jeu, etc.
        // this.router.navigate(['/games', response.gameTable.game]);
        this.createTableForm.reset();
      },
      error: (error) => {
        console.error('Erreur lors de la création de la table:', error);
        this.errorMessage = "Erreur lors de la création de la table. Veuillez vérifier les informations saisies.";
        if (error.error && error.error.error) {
            this.errorMessage = error.error.error; // Affiche le message d'erreur renvoyé par le serveur
        }
      }
    });
  }

    //Mise a jour de la date de fin en fonction de la date de début et de la durée
    updateEndTime() {
        const startTime = this.createTableForm.get('startTime')?.value;
        const duration = this.createTableForm.get('duration')?.value;

        if (startTime && duration) {
        const startDate = new Date(startTime);
        const endDate = new Date(startDate.getTime() + duration * 60000); // Conversion des minutes en millisecondes
        this.createTableForm.get('endTime')?.setValue(this.datePipe.transform(endDate, 'yyyy-MM-ddTHH:mm'));
        }
    }

    get f() { return this.createTableForm.controls; }
}
