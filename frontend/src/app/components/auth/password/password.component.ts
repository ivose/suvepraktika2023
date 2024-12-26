// src/app/components/auth/password/password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent {
  passwordForm: FormGroup = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      this.authService.changePassword({
        oldPassword: this.passwordForm.get('oldPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value
      }).subscribe({
        next: () => {
          this.snackBar.open('Password changed successfully', 'Close', { duration: 3000 });
          this.passwordForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Password change failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}