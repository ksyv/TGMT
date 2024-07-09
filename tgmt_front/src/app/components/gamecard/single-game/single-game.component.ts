import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../../services/game.service';
import { AuthService } from '../../../services/auth.service'; // Importe le service d'authentification
import { Game } from '../../../models/game';

@Component({
  selector: 'app-single-game',
  templateUrl: './single-game.component.html',
  styleUrls: ['./single-game.component.css']
})
export class SingleGameComponent implements OnInit {
  game: Game | undefined;
  isAdmin: boolean = false; // Variable pour vérifier si l'utilisateur est un admin

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private authService: AuthService // Injecte le service d'authentification
  ) { }

  ngOnInit(): void {
    const gameId = this.route.snapshot.paramMap.get('id');

    if (gameId) {
      this.gameService.getGameById(gameId)
        .subscribe(
          response => {
            this.game = response.result;
          },
          error => {
            console.error('Error fetching game details:', error);
          }
        );
    } else {
      console.error('No game ID provided');
    }

    // Vérifie le rôle de l'utilisateur au chargement du composant
    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin'); // Met à jour la variable isAdmin
    });
  }

  updateGame(): void {
    if (this.game) {
      // Appelle le service pour mettre à jour le jeu
      this.gameService.updateGame(this.game).subscribe(
        response => {
          console.log('Jeu mis à jour avec succès:', response);
          // Peut-être afficher un message de succès ou rediriger l'utilisateur
        },
        error => {
          console.error('Erreur lors de la mise à jour du jeu:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }

  deleteGame(): void {
    if (this.game) {
      // Appelle le service pour supprimer le jeu
      this.gameService.deleteGame(this.game._id).subscribe(
        response => {
          console.log('Jeu supprimé avec succès:', response);
          // Peut-être afficher un message de succès ou rediriger l'utilisateur
        },
        error => {
          console.error('Erreur lors de la suppression du jeu:', error);
          // Afficher un message d'erreur à l'utilisateur
        }
      );
    }
  }
}
