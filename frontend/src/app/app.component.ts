import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './models/auth.model';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Library App';
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.authService.currentUser;
  }

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}