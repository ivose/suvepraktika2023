import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Page, PageRequest } from '../models/page';
import { Book } from '../models/book';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RestUtil } from './rest-util';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly baseUrl = environment.backendUrl + '/api/books';

  constructor(private http: HttpClient) {}

  getBooks(filter: Partial<PageRequest>, search?: string): Observable<Page<Book>> {
    let params = RestUtil.buildParamsFromPageRequest(filter);
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Page<Book>>(this.baseUrl, { params });
  }

  saveBook(book: Book): Observable<void> {
    return this.http.post<void>(this.baseUrl, book);
  }

  getBook(bookId: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/${bookId}`);
  }

  updateBook(bookId: string, book: Partial<Book>): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${bookId}`, book);
  }

  deleteBook(bookId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${bookId}`);
  }

  getAvailableBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/available`);
  }

}
