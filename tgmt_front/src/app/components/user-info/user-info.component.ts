import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-user-info', // Selector for using the component in templates.
  templateUrl: './user-info.component.html', // Path to the component's HTML template.
  styleUrls: ['./user-info.component.css'] // Path to the component's CSS styles.
})
export class UserInfoComponent implements OnInit {
  // Object to hold user information.
  userInfo = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: ''
  };

  successMessage: string = ''; // Variable to store the success message.
  errorMessage: string = ''; // Variable to store the error message.

  // Constructor to inject the AuthService.
  constructor(private authService: AuthService) {}

  // Initializes the component and retrieves user information.
  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        // Fetches user info if a user ID is available.
        this.authService.getUserInfo().subscribe(
          (data) => {
            this.userInfo = data; // Assigns the fetched user info to 'userInfo' variable.
          },
          (error) => {
            console.error('Erreur lors de la récupération des informations utilisateur', error);
            this.errorMessage = 'Erreur lors de la récupération des informations utilisateur.';
          }
        );
      }
    });
  }

  // Handles form submission to update user information.
  onSubmit(): void {
    // Calls the AuthService to update user information.
    this.authService.updateUserInfo(this.userInfo).subscribe(
      (response) => {
        console.log('Mise à jour réussie', response);
        this.successMessage = 'Profil mis à jour avec succès.';
        this.errorMessage = ''; // Clears any previous error message.
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des informations', error);
        this.errorMessage = 'Erreur lors de la mise à jour des informations.';
        this.successMessage = ''; // Clears any previous success message.
      }
    );
  }
}
