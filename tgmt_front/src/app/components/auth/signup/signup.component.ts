import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-signup', // Selector for using the component in templates.
  templateUrl: './signup.component.html', // Path to the component's HTML template.
  styleUrls: ['./signup.component.css'] // Path to the component's CSS styles.
})
export class SignupComponent {
  errorForm: any[] = []; // Array to store form errors.
  successMessage: string = ''; // Variable to store the success message.
  // Object to hold signup data.
  signupData = {
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    password: '',
    passwordConfirm: ''
  };

  // Constructor to inject required services.
  constructor(private http: HttpClient, private router: Router) {}

  // Method to handle form submission.
  onSubmit(form: NgForm) {
    // Checks if the form is invalid.
    if (form.invalid) {
      this.errorForm = [];
      // Processes each form control to generate error messages.
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
      return; // Stops the submission process if the form is invalid.
    }

    // Checks if the password and confirmation password match.
    if (this.signupData.password !== this.signupData.passwordConfirm) {
      this.errorForm = [{ passwordMismatch: { message: 'Les mots de passe ne correspondent pas' } }];
      return; // Stops the submission process if passwords don't match.
    }

    // Sends a POST request to the backend to sign up the user.
    this.http.post<any>('http://localhost:3000/users/signup', this.signupData)
      .subscribe(
        response => {
          // If signup is successful:
          console.log('Backend response: ', response);
          this.successMessage = 'Inscription réussie. Redirection en cours...';
          // Redirects to the sign-in page after 2 seconds.
          setTimeout(() => {
            this.router.navigate(['/sign-in']);
          }, 2000);
        },
        error => {
          // If signup fails, handles errors.
          console.error('Error sending data: ', error);
          this.errorForm = [];
          if (error.status === 400 && error.error.message) {
            // Handles specific error for existing user.
            this.errorForm.push({ userExist: { message: 'L\'utilisateur existe déjà' }});
          } else {
            // Handles general signup error.
            this.errorForm = [{ general: 'Une erreur est survenue lors de la création de l\'utilisateur.' }];
          }
        }
      );
  }
}
