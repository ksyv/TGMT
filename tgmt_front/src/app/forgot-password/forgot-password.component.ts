import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {}

  onSubmit() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.authService.forgotPassword(email).subscribe(
      () => {
        this.successMessage = 'Un email de réinitialisation de mot de passe a été envoyé.';
        this.errorMessage = '';
      },
      error => {
        this.successMessage = '';
        this.errorMessage = 'Une erreur s\'est produite lors de la récupération du mot de passe. Veuillez réessayer plus tard.';
      }
    );
  }
}
