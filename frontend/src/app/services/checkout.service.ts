import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page, PageRequest } from '../models/page';
import { RestUtil } from './rest-util';
import { CheckOut } from '../models/checkout.model';


@Injectable({
    providedIn: 'root'
})
export class CheckOutService {
    private readonly baseUrl = environment.backendUrl + '/api/checkouts';

    constructor(private http: HttpClient) { }

    // Get paginated list of checkouts
    getCheckouts_(filter: Partial<PageRequest>): Observable<Page<CheckOut>> {
        const params = RestUtil.buildParamsFromPageRequest(filter);
        return this.http.get<Page<CheckOut>>(this.baseUrl, { params });
    }

    getCheckouts(filter: Partial<PageRequest>, search?: string): Observable<Page<CheckOut>> {
        let params = RestUtil.buildParamsFromPageRequest(filter);
        if (search) {
            params = params.append('search', search);
        }
        return this.http.get<Page<CheckOut>>(this.baseUrl, { params });
    }

    // Get single checkout by ID
    getCheckout(checkoutId: string): Observable<CheckOut> {
        return this.http.get<CheckOut>(`${this.baseUrl}/${checkoutId}`);
    }

    // Create new checkout
    createCheckout(checkout: Omit<CheckOut, 'id'>): Observable<void> {
        return this.http.post<void>(this.baseUrl, checkout);
    }

    // Update existing checkout (e.g., for returns)
    updateCheckout(checkoutId: string, checkout: Partial<CheckOut>): Observable<CheckOut> {
        return this.http.put<CheckOut>(`${this.baseUrl}/${checkoutId}`, checkout);
    }

    // Delete checkout
    deleteCheckout(checkoutId: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${checkoutId}`);
    }

    // Helper method to return a book
    returnBook(checkoutId: string): Observable<CheckOut> {
        return this.updateCheckout(checkoutId, {
            returnedDate: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
        });
    }

    // Helper method to check if a book can be checked out
    canCheckout(bookId: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}/can-checkout/${bookId}`);
    }

    // Helper method to get active checkouts for a specific user
    getUserCheckouts(): Observable<Page<CheckOut>> {
        return this.http.get<Page<CheckOut>>(`${this.baseUrl}/user`);
    }

    // Helper method to get overdue checkouts
    getOverdueCheckouts(): Observable<Page<CheckOut>> {
        return this.http.get<Page<CheckOut>>(`${this.baseUrl}/overdue`);
    }

    // Helper method to extend due date
    extendDueDate(checkoutId: string, days: number): Observable<CheckOut> {
        return this.http.put<CheckOut>(`${this.baseUrl}/${checkoutId}/extend/${days}`, {});
    }
}