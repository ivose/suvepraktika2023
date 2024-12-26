import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Observable } from 'rxjs';
import { Page, PageRequest } from '../../../models/page';
import { User } from '../../../models/user';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UsersFormComponent } from '../form/form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class UsersListComponent implements OnInit {
  users$!: Observable<Page<User>>;
  searchControl = new FormControl('');
  pageSize = 10;
  pageIndex = 0;
  displayedColumns = ['email', 'firstName', 'lastName', 'role', 'actions'];
  isAdmin = false;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe(user => {
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UsersFormComponent, {
      width: '500px',
      data: user || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.userService.updateUser(result.id.toString(), result).subscribe({
            next: () => {
              this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
              this.loadUsers();
            },
            error: (error) => {
              this.snackBar.open('Failed to update user: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        } else {
          this.userService.saveUser(result).subscribe({
            next: () => {
              this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
              this.loadUsers();
            },
            error: (error) => {
              this.snackBar.open('Failed to create user: ' + error.message, 'Close', { duration: 3000 });
            }
          });
        }
      }
    });
  }

  deleteUser(user: User) {
    if (confirm(`Are you sure you want to delete user "${user.firstName} ${user.lastName}"?`)) {
      this.userService.deleteUser(user.id.toString()).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete user: ' + error.message, 'Close', { duration: 3000 });
        }
      });
    }
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadUsers();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadUsers();
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'accent';
      case 'LIBRARIAN': return 'primary';
      default: return 'default';
    }
  }

  private loadUsers() {
    const request: Partial<PageRequest> = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      sort: 'lastName',
      direction: 'asc'
    };

    const searchTerm = this.searchControl.value?.trim();
    this.users$ = this.userService.getUsers(request, searchTerm);
  }
}