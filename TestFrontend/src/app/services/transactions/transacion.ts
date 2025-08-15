import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TransactionInterface } from '@models/transaction';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TransacionService {
    private readonly BASE_URL = `/btr`;
    constructor(private http: HttpClient) { }

    getAllTransactions(): Observable<TransactionInterface[]> {
        return this.http.get<TransactionInterface[]>(`${this.BASE_URL}/get-all`);
    }

    createTransactions(transaction: TransactionInterface): Observable<TransactionInterface> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post<TransactionInterface>(`${this.BASE_URL}/add`, transaction, { headers });
    }

    deleteTransactions(id: string): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/delete/${id}`);
    }

    updateTransactions(transaction: TransactionInterface): Observable<TransactionInterface> {
        return this.http.put<TransactionInterface>(`${this.BASE_URL}/update`, transaction);
    }

    getTransactionsById(id: string): Observable<TransactionInterface> {
        return this.http.get<TransactionInterface>(`${this.BASE_URL}/get-by-id/${id}`);
    }
}
