import { Component, OnInit } from '@angular/core';
import { GameTableService } from '../../services/game-table.service'; //Adapte le chemin
import { AuthService } from '../../services/auth.service'; // Importe AuthService
import { GameService } from '../../services/game.service'; // Import GameService
import { Game } from '../../models/game';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  tables: any[] = [];
  errorMessage: string | null = null;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  userId: string = '';
    games: Game[] = []; // Liste des jeux pour le filtre

    // Variables pour les filtres
    selectedGameId: string | null = null;
    startTimeFilter: string | null = null;
    endTimeFilter: string | null = null;
    openFilter: string | null = null;

    constructor(
        private gameTableService: GameTableService,
        private authService: AuthService, // Injection d'AuthService
        private gameService: GameService // Injection de GameService
    ) { }

  ngOnInit(): void {
    this.loadAllTables();
    this.authService.getRole().subscribe(role => { // Récupère le rôle
      this.isAdmin = (role === 'admin');
      this.isLoggedIn = !!role; // Important : Déduit l'état de connexion du rôle
    });

    this.authService.getUserId().subscribe( // Récupère l'ID
      userId => {
        this.userId = userId || '';  // Gère le cas où userId est null
      },
      error => {
        console.error('Error fetching user ID:', error);
      }
    );
      this.loadGames(); // Charge la liste des jeux
  }
    loadGames(): void {
        this.gameService.getGames().subscribe({
            next: (data: any) => {
                this.games = data.result;
            },
            error: (error) => {
                console.error('Erreur lors de la récupération des jeux:', error);
            }
        });
    }

    loadAllTables(): void {
      // Crée un objet pour stocker les paramètres de filtre (uniquement ceux qui sont définis)
      const filterParams: any = {};

      if (this.selectedGameId) {
        filterParams.gameId = this.selectedGameId;
      }
      if (this.startTimeFilter) {
        filterParams.startTime = this.startTimeFilter;
      }
      if (this.endTimeFilter) {
        filterParams.endTime = this.endTimeFilter;
      }
      if (this.openFilter !== null && this.openFilter !== undefined && this.openFilter !== '') {
        filterParams.available = this.openFilter;
      }

      this.gameTableService.getAllTables(filterParams).subscribe({ // Passe les paramètres
        next: (tables: any[]) => {
          this.tables = tables;
            this.checkUserRegistration(); //Verifie l'état d'inscription
        },
        error: (error) => {
          console.error('Error fetching all tables:', error);
          this.errorMessage = "Erreur lors du chargement des tables.";
        }
      });
    }
    //VERIFICATION DE L INSCRIPTION
    checkUserRegistration(): void {
        if (this.tables && this.userId) {
            this.tables.forEach(table => {
                table.isUserRegistered = this.isUserRegisteredToTable(table);
            });
        }
    }

    // Méthode pour vérifier si l'utilisateur est inscrit à une table donnée
    isUserRegisteredToTable(table: any): boolean {
        if(!table.participants){ //Si la table n'a pas de participants
            return false;
        }
        return table.participants.some((participant: any) => participant._id === this.userId); //Verifie si l'id de l'utilisateur apparait dans le tableau des participants
    }

    // Méthode pour s'inscrire à une table
    joinTable(tableId: string): void {
        if (!this.userId) {
        console.error("User ID is not available. Cannot join table.");
        this.errorMessage = "Vous devez être connecté pour vous inscrire à une table."; // Message d'erreur
        return; // Arrêt si pas connecté
        }

        this.gameTableService.joinTable(tableId).subscribe({
        next: () => {
            console.log('Successfully joined table');
            this.errorMessage = null; // Efface les messages d'erreur
            this.loadAllTables(); // Recharge les tables pour mettre à jour l'affichage
        },
        error: (error) => { // Gère l'erreur !
            console.error('Error joining table:', error);
            if (error.status === 400) {
            if (error.error && error.error.error) {
                this.errorMessage = error.error.error; // Message d'erreur du backend
            } else {
                this.errorMessage = "Erreur lors de l'inscription : table pleine ou vous êtes déjà inscrit.";
            }
            } else {
            this.errorMessage = "Une erreur est survenue lors de l'inscription à la table.";
            }
        }
        });
    }

    // Méthode pour se désinscrire d'une table
    leaveTable(tableId: string): void {
    if (!this.userId) {
        console.error("User ID is not available. Cannot leave table.");
        this.errorMessage = "Vous devez être connecté pour vous désinscrire d'une table."; // Message d'erreur
        return; // Arrêt si pas connecté
    }

    this.gameTableService.leaveTable(tableId).subscribe({
        next: () => {
        console.log('Successfully left table');
        this.errorMessage = null; // Efface les messages d'erreur
        this.loadAllTables();
        },
        error: (error) => {
        console.error('Error leaving table:', error);
        if (error.status === 400) {
            if(error.error && error.error.error){
                this.errorMessage = error.error.error;

            } else {
                this.errorMessage = "Erreur lors de la désinscription. Veuillez réessayer."
            }
        } else {
            this.errorMessage = "Une erreur est survenue lors de la désinscription de la table.";
        }
        }
        });
    }
    // Méthode pour supprimer une table
    deleteTable(tableId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette table de jeu ?')) {
      this.gameTableService.deleteTable(tableId).subscribe({
        next: () => {
          console.log('Table supprimée avec succès');
          this.loadAllTables(); // Recharge la liste des tables
        },
        error: (error) => {
          console.error('Erreur lors de la suppression de la table:', error);
        }
      });
    }
  }

    participantsList(table: any): string {
        if (!table.participants || table.participants.length === 0) {
            return '';
        }
        return table.participants.map((p: any) => p.username).join(', ');
    }

    onFilter(): void {
      this.loadAllTables(); // Appelle loadAllTables avec les paramètres de filtre
  }

  // Méthode pour réinitialiser les filtres
  resetFilters(): void {
      this.selectedGameId = null;
      this.startTimeFilter = null;
      this.endTimeFilter = null;
      this.openFilter = null;
      this.loadAllTables(); // Recharge les tables sans filtre
  }
}
