import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  userInfo = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: ''
  };

  successMessage: string = ''; // Variable pour stocker le message de succès
  errorMessage: string = ''; // Variable pour stocker le message d'erreur

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      if (userId) {
        this.authService.getUserInfo().subscribe(
          (data) => {
            this.userInfo = data;
          },
          (error) => {
            console.error('Erreur lors de la récupération des informations utilisateur', error);
            this.errorMessage = 'Erreur lors de la récupération des informations utilisateur.';
          }
        );
      }
    });
  }

  onSubmit(): void {
    this.authService.updateUserInfo(this.userInfo).subscribe(
      (response) => {
        console.log('Mise à jour réussie', response);
        this.successMessage = 'Profil mis à jour avec succès.';
        this.errorMessage = ''; // Réinitialiser le message d'erreur
      },
      (error) => {
        console.error('Erreur lors de la mise à jour des informations', error);
        this.errorMessage = 'Erreur lors de la mise à jour des informations.';
        this.successMessage = ''; // Réinitialiser le message de succès
      }
    );
  }
}
