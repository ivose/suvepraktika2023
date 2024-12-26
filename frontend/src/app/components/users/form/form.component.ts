import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from '../../../models/user';
import { Role } from '../../../models/role';

@Component({
  selector: 'app-users-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class UsersFormComponent {
  userForm: FormGroup;
  roles: Role[] = ['ADMIN', 'LIBRARIAN', 'USER'];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsersFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User | null
  ) {
    this.userForm = this.fb.group({
      email: [data?.email || '', [Validators.required, Validators.email]],
      firstName: [data?.firstName || '', Validators.required],
      lastName: [data?.lastName || '', Validators.required],
      role: [data?.role || 'USER', Validators.required]
    });

    if (data?.id) {
      this.userForm.get('email')?.disable();
    }
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userData = {
        ...this.data,
        ...this.userForm.value,
        email: this.userForm.get('email')?.value || this.data?.email
      };
      this.dialogRef.close(userData);
    }
  }
}