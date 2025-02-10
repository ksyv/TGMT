import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-dashboard', // Selector for using the component in templates.
  templateUrl: './dashboard.component.html', // Path to the component's HTML template.
  styleUrls: ['./dashboard.component.css'] // Path to the component's CSS styles.
})
export class DashboardComponent implements OnInit {
  isAdmin = false; // Flag to indicate if the user is an admin.
  selectedTab: string = 'mes-informations'; // Currently selected tab.

  // Constructor to inject the AuthService.
  constructor(private authService: AuthService) { }

  // Initializes the component and checks the user's role.
  ngOnInit(): void {
    this.authService.getRole().subscribe(role => {
      this.isAdmin = (role === 'admin'); // Sets the isAdmin flag based on the user's role.
    });
    console.log("Initial selectedTab:", this.selectedTab);
  }
  selectManageHours() { // REMPLACE le (click) par (click)="selectManageHours()"
    this.selectedTab = 'manage-hours';
    console.log("selectedTab changed to:", this.selectedTab); // AJOUTE
  }
}
