// src/app/components/auth/signup/signup.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SignupRequest } from 'src/app/models/auth.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.signupForm.valid) {
      const signupData: SignupRequest = {
        email: this.signupForm.get('email')?.value,
        password: this.signupForm.get('password')?.value,
        firstName: this.signupForm.get('firstName')?.value,
        lastName: this.signupForm.get('lastName')?.value
      };

      this.authService.signup(signupData).subscribe({
        next: () => {
          this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.snackBar.open('Registration failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}