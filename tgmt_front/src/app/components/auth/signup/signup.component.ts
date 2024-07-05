import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  errorForm: any[] = [];
  successMessage: string = '';
  signupData = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorForm = [];
      if (form.controls['username'] && form.controls['username'].errors) {
        this.errorForm.push({ username: { message: 'Nom d\'utilisateur est requis' } });
      }
      if (form.controls['firstname'] && form.controls['firstname'].errors) {
        this.errorForm.push({ firstname: { message: 'Prénom est requis' } });
      }
      if (form.controls['lastname'] && form.controls['lastname'].errors) {
        this.errorForm.push({ lastname: { message: 'Nom est requis' } });
      }
      if (form.controls['email'] && form.controls['email'].errors) {
        this.errorForm.push({ email: { message: 'Email est requis' } });
      }
      if (form.controls['telephone'] && form.controls['telephone'].errors) {
        this.errorForm.push({ telephone: { message: 'Téléphone est requis' } });
      }
      if (form.controls['password'] && form.controls['password'].errors) {
        this.errorForm.push({ password: { message: 'Mot de passe est requis' } });
      }
      if (form.controls['passwordConfirm'] && form.controls['passwordConfirm'].errors) {
        this.errorForm.push({ passwordConfirm: { message: 'Confirmation de mot de passe est requis' } });
      }
      return;
    }

    if (this.signupData.password !== this.signupData.passwordConfirm) {
      this.errorForm = [{ passwordMismatch: { message: 'Les mots de passe ne correspondent pas' } }];
      return;
    }

    this.http.post<any>('http://localhost:3000/users/signup', this.signupData)
      .subscribe(
        response => {
          console.log('Backend response: ', response);
          this.successMessage = 'Inscription réussie. Redirection en cours...';
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
          }, 2000); // Redirection après 2 secondes
        },
        error => {
          console.error('Error sending data: ', error);
          this.errorForm = [];
          if (error.status === 400 && error.error.message) {
            this.errorForm.push({ userExist: { message: 'L\'utilisateur existe déjà' }});
          } else {
            this.errorForm = [{ general: 'Une erreur est survenue lors de la création de l\'utilisateur.' }];
          }
        }
      );
  }
}
