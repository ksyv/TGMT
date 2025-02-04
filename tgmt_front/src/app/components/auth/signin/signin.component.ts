import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

// Component decorator to define metadata for the component.
@Component({
  selector: 'app-signin', // Selector for using the component in templates.
  templateUrl: './signin.component.html', // Path to the component's HTML template.
  styleUrls: ['./signin.component.css'] // Path to the component's CSS styles.
})
export class SigninComponent {
  // Object to hold sign-in data (email and password).
  signInData = {
    email: '',
    password: ''
  };
  errorForm: any[] = []; // Array to store form errors.

  // Constructor to inject required services.
  constructor(
    private authService: AuthService, // Service to handle authentication logic.
    private router: Router, // Service for programmatic navigation.
    private route: ActivatedRoute // Service to access route parameters.
    ) {}

  // Method to handle form submission.
  onSubmit(form: NgForm) {
    this.errorForm = []; // Clears any previous errors.

    if (form.invalid) {
      // Handles form errors if the form is invalid.
      return;
    }

    // Calls the AuthService to log in the user.
    this.authService.login(this.signInData.email, this.signInData.password)
      .subscribe(
        (response: any) => {
          // If login is successful:
          this.errorForm = []; // Clears any previous errors.

          // Redirects based on user role.
          if (response.role === 'admin') {
            this.router.navigateByUrl('/admin/dashboard'); // Redirects admins to the admin dashboard.
          } else {
            // Redirects non-admin users to a default or previously intended page.
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigateByUrl(returnUrl);
          }
        },
        (error: any) => {
          // If login fails, handles errors.
          console.error('Login error:', error);
          this.errorForm.push({ general: 'Erreur de connexion. Veuillez réessayer plus tard.' });
        }
      );
  }
}
