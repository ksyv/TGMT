import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteGames: any[] = [];
  userId: string = '';

  constructor(
    private authService: AuthService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
      this.loadFavorites();
    });
  }

  loadFavorites(): void {
    if (this.userId) {
      this.gameService.getFavorites(this.userId).subscribe(
        favorites => {
          this.favoriteGames = favorites;
        },
        error => {
          console.error('Error fetching favorite games:', error);
        }
      );
    }
  }
}
