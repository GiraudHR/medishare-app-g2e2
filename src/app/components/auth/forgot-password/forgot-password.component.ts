import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
      imports: [
        CommonModule,
        ReactiveFormsModule,
      ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
forgotPasswordForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  emailSent = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    // Si ya está autenticado, redirigir al dashboard
    /*if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }*/
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          this.loading = false;
          this.emailSent = true;
          this.successMessage = 'Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.';
          
          // Opcional: limpiar el formulario
          this.forgotPasswordForm.reset();
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Ocurrió un error. Por favor intenta nuevamente.';
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendEmail(): void {
    if (this.forgotPasswordForm.get('email')?.value) {
      this.onSubmit();
    } else {
      this.emailSent = false;
      this.successMessage = '';
    }
  }

  get email() { 
    return this.forgotPasswordForm.get('email'); 
  }
}