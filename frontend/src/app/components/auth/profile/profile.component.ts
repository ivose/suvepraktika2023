// src/app/components/auth/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/auth.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      this.profileForm.patchValue({
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const profileData: Partial<User> = {
        email: this.profileForm.get('email')?.value,
        firstName: this.profileForm.get('firstName')?.value,
        lastName: this.profileForm.get('lastName')?.value
      };

      this.authService.updateProfile(profileData).subscribe({
        next: () => {
          this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Profile update failed: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}