import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  selectedTab: string = 'mes-informations';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin');
    });
  }
}

