import { Component, OnInit } from '@angular/core';
import { CheckOutService } from '../../../services/checkout.service';
import { CheckOut } from '../../../models/checkout.model';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class CheckoutDetailComponent implements OnInit {
  checkout$!: Observable<CheckOut>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckOutService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkout$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.checkoutService.getCheckout(id))
    );
  }

  returnBook(checkout: CheckOut) {
    this.checkoutService.returnBook(checkout.id).subscribe({
      next: () => {
        this.snackBar.open('Book returned successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/checkouts']);
      },
      error: (error) => {
        this.snackBar.open('Failed to return book: ' + error.message, 'Close', { duration: 3000 });
      }
    });
  }

  extendDueDate(checkout: CheckOut) {
    /*const newDate = new Date(checkout.dueDate);
    newDate.setDate(newDate.getDate() + 7);
    this.checkoutService.extendDueDate(checkout.id, newDate.toISOString().split('T')[0]).subscribe({
      next: () => {
        this.snackBar.open('Due date extended successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/checkouts']);
      },
      error: (error) => {
        this.snackBar.open('Failed to extend due date: ' + error.message, 'Close', { duration: 3000 });
      }
    });*/
  }
}