import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-forgot-password', // Selector for using the component in templates.
  templateUrl: './forgot-password.component.html', // Path to the component's HTML template.
  styleUrls: ['./forgot-password.component.css'] // Path to the component's CSS styles.
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup; // Form group to manage the form data.
  successMessage: string = ''; // Variable to store the success message.
  errorMessage: string = ''; // Variable to store the error message.

  // Constructor to inject required services.
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    // Initializes the form with email field and validators.
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]] // Email field with required and email validators.
    });
  }

  // ngOnInit lifecycle hook, not used in this component.
  ngOnInit() {}

  // Handles form submission.
  onSubmit() {
    // Checks if the form is invalid.
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email; // Retrieves the email from the form.
    // Calls the AuthService to send a password reset email.
    this.authService.forgotPassword(email).subscribe(
      () => {
        // Success: Sets the success message and clears any previous error message.
        this.successMessage = 'Un email de réinitialisation de mot de passe a été envoyé.';
        this.errorMessage = '';
      },
      error => {
        // Error: Clears any previous success message and sets an error message.
        this.successMessage = '';
        this.errorMessage = 'Une erreur s\'est produite lors de la récupération du mot de passe. Veuillez réessayer plus tard.';
      }
    );
  }
}
