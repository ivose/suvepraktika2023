import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-extend-dialog',
  templateUrl: './extend.component.html',
  styles: [`
    mat-form-field {
      width: 100%;
      min-width: 250px;
    }
    mat-dialog-content {
      padding-top: 20px;
    }
  `]
})
export class CheckoutExtendComponent {
  extendForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CheckoutExtendComponent>
  ) {
    this.extendForm = this.fb.group({
      days: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.extendForm.valid) {
      this.dialogRef.close(this.extendForm.get('days')?.value);
    }
  }
}