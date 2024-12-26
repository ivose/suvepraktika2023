// books-list.component.ts
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../../../models/page';
import { Book } from '../../../models/book';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { BookFormComponent } from '../form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-books-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class BooksListComponent implements OnInit {
  books$!: Observable<Page<Book>>;
  searchControl = new FormControl('');
  pageSize = 10;
  pageIndex = 0;
  displayedColumns = ['title', 'author', 'genre', 'status', 'actions'];
  canManageBooks = false;

  constructor(
    private bookService: BookService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.canManageBooks = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
    });
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'AVAILABLE': return 'primary';
      case 'BORROWED': return 'warn';
      case 'RETURNED': return 'accent';
      case 'DAMAGED': return 'warn';
      default: return 'primary';
    }
  }

  openBookDialog(book?: Book) {
    const dialogRef = this.dialog.open(BookFormComponent, {
      width: '500px',
      data: book || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.bookService.updateBook(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Book updated successfully', 'Close', { duration: 3000 });
              this.loadBooks();
            },
            error: (error) => {
              this.snackBar.open('Failed to update book: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        } else {
          this.bookService.saveBook(result).subscribe({
            next: () => {
              this.snackBar.open('Book created successfully', 'Close', { duration: 3000 });
              this.loadBooks();
            },
            error: (error) => {
              this.snackBar.open('Failed to create book: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteBook(book: Book) {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      this.bookService.deleteBook(book.id).subscribe({
        next: () => {
          this.snackBar.open('Book deleted successfully', 'Close', { duration: 3000 });
          this.loadBooks();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete book: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadBooks();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadBooks();
  }

  private loadBooks() {
    const request: Partial<PageRequest> = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sort: 'title',
      direction: 'asc'
    };

    const searchTerm = this.searchControl.value?.trim();
    this.books$ = this.bookService.getBooks(request, searchTerm || undefined);
  }
}