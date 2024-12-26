import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, SignupRequest, User, PasswordReset, PasswordChange, ForgotPassword } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.backendUrl}/api/auth/login`, credentials)
      .pipe(map(response => {
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
        return response;
      }));
  }

  signup(userData: SignupRequest): Observable<User> {
    return this.http.post<User>(`${environment.backendUrl}/api/auth/signup`, userData);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  forgotPassword(data: ForgotPassword): Observable<void> {
    return this.http.post<void>(`${environment.backendUrl}/api/auth/forgot-password`, data);
  }

  resetPassword(data: PasswordReset): Observable<void> {
    return this.http.put<void>(`${environment.backendUrl}/api/auth/reset-password`, data);
  }

  changePassword(data: PasswordChange): Observable<void> {
    // TODO check that the user is logged in
    return this.http.put<void>(`${environment.backendUrl}/api/auth/password-password`, data);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    // TODO check that the user is logged in
    return this.http.put<User>(`${environment.backendUrl}/api/auth/profile`, data)
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
}