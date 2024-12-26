import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Material Imports
import { MaterialModule } from './material/material.module';

// Components
import { AppComponent } from './app.component';
import { BooksListComponent } from './components/books/list/list.component';
import { BookDetailComponent } from './components/books/detail/detail.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { ResetComponent } from './components/auth/reset/reset.component';
import { ProfileComponent } from './components/auth/profile/profile.component';
import { PasswordComponent } from './components/auth/password/password.component';

// Routing
import { AppRoutingModule } from './app-routing.module';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { BookFormComponent } from './components/books/form/form.component';
import { CheckOutsListComponent } from './components/checkouts/list/list.component';
import { CheckoutDetailComponent } from './components/checkouts/detail/detail.component';
import { CheckoutFormComponent } from './components/checkouts/form/form.component';
import { CheckoutExtendComponent } from './components/checkouts/extend/extend.component';
import { UsersListComponent } from './components/users/list/list.component';
import { UsersDetailComponent } from './components/users/detail/detail.component';
import { UsersFormComponent } from './components/users/form/form.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    BookDetailComponent,
    BookFormComponent,
    CheckOutsListComponent,
    CheckoutDetailComponent,
    CheckoutFormComponent,
    CheckoutExtendComponent,
    UsersListComponent,
    LoginComponent,
    SignupComponent,
    ResetComponent,
    ProfileComponent,
    PasswordComponent,
    UsersDetailComponent,
    UsersFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    A11yModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }