import { Component, OnInit } from '@angular/core';
import { CheckOutService } from '../../../services/checkout.service';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../../../models/page';
import { CheckOut } from '../../../models/checkout.model';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutFormComponent } from '../form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { CheckoutExtendComponent } from '../extend/extend.component';

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CheckOutsListComponent implements OnInit {
  checkouts$!: Observable<Page<CheckOut>>;
  searchControl = new FormControl('');
  pageSize = 10;
  pageIndex = 0;
  displayedColumns = ['borrowerName', 'bookTitle', 'checkedOutDate', 'dueDate', 'status', 'actions'];
  canManageCheckouts = false;

  constructor(
    private checkoutService: CheckOutService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.canManageCheckouts = user?.role === 'ADMIN' || user?.role === 'LIBRARIAN';
    });
  }

  ngOnInit(): void {
    this.loadCheckouts();
  }

  openCheckoutDialog(checkout?: CheckOut) {
    const dialogRef = this.dialog.open(CheckoutFormComponent, {
      width: '500px',
      data: checkout || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.checkoutService.updateCheckout(result.id, result).subscribe({
            next: () => {
              this.snackBar.open('Checkout updated successfully', 'Close', { duration: 3000 });
              this.loadCheckouts();
            },
            error: (error) => {
              this.snackBar.open('Failed to update checkout: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        } else {
          this.checkoutService.createCheckout(result).subscribe({
            next: () => {
              this.snackBar.open('Checkout created successfully', 'Close', { duration: 3000 });
              this.loadCheckouts();
            },
            error: (error) => {
              this.snackBar.open('Failed to create checkout: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  returnBook(checkout: CheckOut) {
    this.checkoutService.returnBook(checkout.id).subscribe({
      next: () => {
        this.snackBar.open('Book returned successfully', 'Close', { duration: 3000 });
        this.loadCheckouts();
      },
      error: (error) => {
        this.snackBar.open('Failed to return book: ' + error.message, 'Close', { duration: 3000 });
      }
    });
  }

  extendDueDate(checkout: CheckOut) {
    const dialogRef = this.dialog.open(CheckoutExtendComponent);

    dialogRef.afterClosed().subscribe(days => {
      if (days) {
        this.checkoutService.extendDueDate(checkout.id, days).subscribe({
          next: () => {
            this.snackBar.open('Due date extended successfully', 'Close', { duration: 3000 });
            this.loadCheckouts();
          },
          error: (error) => {
            this.snackBar.open('Failed to extend due date: ' + error.message, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteCheckout(checkout: CheckOut) {
    if (confirm(`Are you sure you want to delete this checkout record?`)) {
      this.checkoutService.deleteCheckout(checkout.id).subscribe({
        next: () => {
          this.snackBar.open('Checkout deleted successfully', 'Close', { duration: 3000 });
          this.loadCheckouts();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete checkout: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadCheckouts();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadCheckouts();
  }

  private loadCheckouts() {
    const request: Partial<PageRequest> = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sort: 'checkedOutDate',
      direction: 'desc'
    };

    const searchTerm = this.searchControl.value?.trim();
    this.checkouts$ = this.checkoutService.getCheckouts(request, searchTerm);
  }
}