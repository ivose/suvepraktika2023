import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './components/books/list/list.component';
import { BookDetailComponent } from './components/books/detail/detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ResetComponent } from './components/auth/reset/reset.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutDetailComponent } from './components/checkouts/detail/detail.component';
import { CheckOutsListComponent } from './components/checkouts/list/list.component';
import { UsersDetailComponent } from './components/users/detail/detail.component';
import { UsersListComponent } from './components/users/list/list.component';

const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  //{ path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'books/:id', component: BookDetailComponent },
  { path: 'books', component: BooksListComponent },
  { path: 'checkouts/:id', component: CheckoutDetailComponent, canActivate: [AuthGuard] },
  { path: 'checkouts', component: CheckOutsListComponent, canActivate: [AuthGuard] }, // Add these
  { path: 'users/:id', component: UsersDetailComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersListComponent, canActivate: [AuthGuard] },
  //{ path: 'checkouts/:id', component:  },
  //{ path: 'users/:id', component: BookDetailComponent },
  //{ path: 'users', component: BooksListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }