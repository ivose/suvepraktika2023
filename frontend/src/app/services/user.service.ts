import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = environment.backendUrl + '/api/users';

  constructor(private http: HttpClient) {}

  getUsers(filter: Partial<PageRequest>, search?: string): Observable<Page<User>> {
    let params = RestUtil.buildParamsFromPageRequest(filter);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Page<User>>(this.baseUrl, { params });
  }

  saveUser(user: User): Observable<void> {
    return this.http.post<void>(this.baseUrl, user);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  updateUser(userId: string, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, user);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}`);
  }

}
