import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.isLoggedIn = role !== null && role !== '';
    });
  }

  onLogout() {
    this.authService.logout();
  }
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
}
}
