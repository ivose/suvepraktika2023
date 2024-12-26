import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Book } from '../../../models/book';
import { BookStatus } from '../../../models/book-status';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class BookFormComponent {
  bookForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<BookFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Book | null
  ) {
    this.bookForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      author: [data?.author || '', Validators.required],
      genre: [data?.genre || '', Validators.required],
      year: [data?.year || new Date().getFullYear(), [Validators.required, Validators.min(1000)]],
      status: [data?.status || 'AVAILABLE', Validators.required],
      comment: [data?.comment || '']
    });
  }

  onSubmit() {
    if (this.bookForm.valid) {
      const book = {
        ...this.data,
        ...this.bookForm.value
      };
      this.dialogRef.close(book);
    }
  }
}
