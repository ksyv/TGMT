import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.isLoggedIn = role !== ''; // Vérifie si un rôle est défini (connecté)
    });
  }

  onLogout() {
    this.authService.logout();
  }
}
