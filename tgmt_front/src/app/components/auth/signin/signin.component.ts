import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  errorForm: any[] = [];

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  onSubmit(form: NgForm) {
    this.errorForm = [];

    if (form.invalid) {
      // Gérer les erreurs de formulaire
      return;
    }

    this.authService.login(this.signInData.email, this.signInData.password)
      .subscribe(
        (response: any) => {
          // Si la connexion réussit
          this.errorForm = [];

          // Redirection en fonction du rôle
          if (response.role === 'admin') {
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
            this.router.navigateByUrl(returnUrl);
          }
        },
        (error: any) => {
          // Si la connexion échoue, gérer les erreurs
          console.error('Login error:', error);
          this.errorForm.push({ general: 'Erreur de connexion. Veuillez réessayer plus tard.' });
        }
      );
  }
}

