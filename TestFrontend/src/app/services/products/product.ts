import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductInterface } from '@models/product';
import { UpdateProductInterface } from '@models/update-product';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly BASE_URL = `/bprd`;
    constructor(private http: HttpClient) { }

    getAllProducts(): Observable<ProductInterface[]> {
        return this.http.get<ProductInterface[]>(`${this.BASE_URL}/get-all`);
    }

    createProduct(product: ProductInterface): Observable<ProductInterface> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this.http.post<ProductInterface>(`${this.BASE_URL}/add`, product, { headers });
    }

    deleteProduct(id: string): Observable<void> {
        return this.http.delete<void>(`${this.BASE_URL}/delete/${id}`);
    }

    updateProduct(product: ProductInterface): Observable<ProductInterface> {
        return this.http.put<ProductInterface>(`${this.BASE_URL}/update`, product);
    }

    getProductById(id: string): Observable<ProductInterface> {
        return this.http.get<ProductInterface>(`${this.BASE_URL}/get-by-id/${id}`);
    }

    updateProductStock(product: UpdateProductInterface): Observable<ProductInterface> {
        return this.http.put<ProductInterface>(`${this.BASE_URL}/update-stock`, product);
    }
}
