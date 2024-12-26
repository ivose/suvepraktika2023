import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CheckOut } from '../../../models/checkout.model';
import { BookService } from '../../../services/book.service';
import { Observable } from 'rxjs';
import { Book } from '../../../models/book';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CheckoutFormComponent {
  checkoutForm: FormGroup;
  books$: Observable<Book[]>;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    public dialogRef: MatDialogRef<CheckoutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CheckOut | null
  ) {
    this.checkoutForm = this.fb.group({
      borrowerFirstName: [data?.borrowerFirstName || '', Validators.required],
      borrowerLastName: [data?.borrowerLastName || '', Validators.required],
      borrowedBook: [data?.borrowedBook || null, Validators.required],
      checkedOutDate: [data?.checkedOutDate || new Date().toISOString().split('T')[0], Validators.required],
      dueDate: [data?.dueDate || '', Validators.required],
      returnedDate: [data?.returnedDate || null]
    });

    // Load available books
    this.books$ = this.bookService.getAvailableBooks();
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const checkout = {
        ...this.data,
        ...this.checkoutForm.value,
      };
      this.dialogRef.close(checkout);
    }
  }
}