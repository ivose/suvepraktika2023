import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UsersFormComponent } from '../form/form.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class UsersDetailComponent implements OnInit {
  user$!: Observable<User>;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  ngOnInit(): void {
    this.user$ = this.route.params.pipe(
      map(params => params['id']),
      switchMap(id => this.userService.getUser(id))
    );
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'accent';
      case 'LIBRARIAN': return 'primary';
      default: return 'default';
    }
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: '500px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id.toString(), result).subscribe({
          next: () => {
            this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
            // Refresh the user data
            this.user$ = this.userService.getUser(user.id.toString());
          },
          error: (error) => {
            this.snackBar.open('Failed to update user: ' + error.message, 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) {
      this.userService.deleteUser(user.id.toString()).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/users']);
        },
        error: (error) => {
          this.snackBar.open('Failed to delete user: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }
}