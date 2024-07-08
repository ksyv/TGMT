import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signInData = {
    email: '',
    password: ''
  };
  errorForm: any[] = []; // Variable pour stocker le message d'erreur

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    this.errorForm = [];

    if (form.invalid) {
      if (form.controls['email'] && form.controls['email'].errors) {
        this.errorForm.push({ email: { message: 'Email est requis' } });
      }
      if (form.controls['password'] && form.controls['password'].errors) {
        this.errorForm.push({ password: { message: 'Mot de passe est requis' } });
      }
      return;
    }

    // Appel de la méthode login de AuthService
    this.authService.login(this.signInData.email, this.signInData.password)
      .subscribe(
        (response: any) => {
          // Si la connexion réussit, gérer la réponse
          this.authService.roleSubject.next(response.isAdmin ? 'admin' : 'user');
          this.authService.userIdSubject.next(response.userId);
          localStorage.setItem('token', response.token);
          this.errorForm = []; // Réinitialiser le message d'erreur
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          // Si la connexion échoue, gérer l'erreur
          if (error.status === 401) {
            this.errorForm.push({ password: { message: 'Mot de passe incorrect' } });
          } else {
            this.errorForm.push({ general: 'Erreur de serveur. Veuillez réessayer plus tard.' });
          }
        }
      );
  }
}

