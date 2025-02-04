import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-reset-password', // Selector for using the component in templates.
  templateUrl: './reset-password.component.html', // Path to the component's HTML template.
  styleUrls: ['./reset-password.component.css'] // Path to the component's CSS styles.
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup; // Form group to manage the form data.
  token: string = ''; // Variable to store the password reset token.
  errorMessage: string = ''; // Variable to store error messages.

  // Constructor to inject required services.
  constructor(
    private route: ActivatedRoute, // Service to access route parameters.
    private fb: FormBuilder, // Service to create form groups and controls.
    private authService: AuthService, // Service to handle authentication logic.
    private router: Router // Service for programmatic navigation.
  ) {
    // Initializes the form with password and confirmPassword fields and validators.
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field with required and minLength validators.
      confirmPassword: ['', [Validators.required]] // Confirm password field with required validator.
    }, { validator: this.passwordsMatch }); // Custom validator to check if passwords match.
  }

  // Initializes the component and retrieves the password reset token from the URL.
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || ''; // Retrieves the token from query parameters.
    });
  }

  // Custom validator to check if password and confirmPassword fields match.
  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    // Returns null if passwords match, otherwise returns an error object.
    return password === confirmPassword ? null : { notMatching: true };
  }

  // Handles form submission.
  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('password')?.value;

      // Calls the AuthService to reset the password.
      this.authService.resetPassword(this.token, newPassword).subscribe(
        response => {
          console.log('Mot de passe réinitialisé avec succès:', response);
          this.router.navigate(['/sign-in']); // Navigates to the sign-in page on success.
        },
        error => {
          console.error('Erreur lors de la réinitialisation du mot de passe:', error);
          // Sets the error message based on the error response.
          this.errorMessage = error.error.message || 'Erreur lors de la réinitialisation du mot de passe';
        }
      );
    }
  }
}
