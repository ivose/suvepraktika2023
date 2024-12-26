// src/app/components/auth/reset/reset.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validator: this.passwordMatchValidator });

  token: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        this.router.navigate(['/auth/login']);
      }
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.resetForm.valid && this.token) {
      this.authService.resetPassword({
        token: this.token,
        password: this.resetForm.get('password')?.value
      }).subscribe({
        next: () => {
          this.snackBar.open('Password reset successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.snackBar.open('Password reset failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}