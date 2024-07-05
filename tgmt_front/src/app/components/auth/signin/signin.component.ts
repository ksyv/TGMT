// signin.component.ts

import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  errorForm: any[] = [];
  successMessage = false; // Ajout de la variable pour gérer le message de succès
  signInData = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.http.post<any>('http://localhost:3000/users/login', this.signInData)
      .subscribe(
        response => {
          localStorage.setItem('token', response.token);
          this.successMessage = true; // Afficher le message de succès
          // Optionnel : Redirection vers une page spécifique après connexion
          // this.router.navigate(['/dashboard']);
        },
        error => {
          this.errorForm = [{ message: 'Email ou mot de passe incorrect' }];
          console.error('Error sending data: ', error);
        }
      );
  }
}
