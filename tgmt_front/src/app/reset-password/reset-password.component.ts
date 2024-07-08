import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';  // Initialisation de la propriété 'token'
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.token = params['token'] || '';  // Récupération du token de l'URL de manière asynchrone
    });
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notMatching: true };
  }

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('password')?.value;

      // Appel de la méthode resetPassword du service AuthService avec le token et le nouveau mot de passe
      this.authService.resetPassword(this.token, newPassword).subscribe(
        response => {
          console.log('Mot de passe réinitialisé avec succès:', response);
          this.router.navigate(['/sign-in']);
        },
        error => {
          console.error('Erreur lors de la réinitialisation du mot de passe:', error);
          this.errorMessage = error.error.message || 'Erreur lors de la réinitialisation du mot de passe';
        }
      );
    }
  }
}
