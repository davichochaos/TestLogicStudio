import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductInterface } from '@models/product';
import { ProductService } from '@services/products/product';
import { ConfirmComponent } from '@modals/confirm.component/confirm.component';

@Component({
    selector: 'app-list-product',
    imports: [CommonModule, ConfirmComponent],
    templateUrl: './list-product.html',
    styleUrl: './list-product.css'
})
export class ListProductComponent {
    @ViewChild(ConfirmComponent) confirm!: ConfirmComponent;
    private productService = inject(ProductService);

    products = signal<ProductInterface[]>([]);
    searchTerm = signal('');
    itemsPerPage = signal(5);
    currentPage = signal(1);

    constructor(private router: Router) { }

    ngOnInit() {
        this.getAllProducts();
    }

    getAllProducts() {
        this.productService.getAllProducts().subscribe({
            next: (response) => {
                const productsArray = response || [];
                this.products.set(productsArray);
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.products.set([]);
            },
        });
    }

    filteredProducts = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.products();

        return this.products().filter(product =>
            product.productoNombre.toLowerCase().includes(term) ||
            product.productoDescripcion.toLowerCase().includes(term) ||
            product.productoCategoria.toLowerCase().includes(term)
        );
    });

    paginatedProducts = computed(() => {
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        const end = start + this.itemsPerPage();
        return this.filteredProducts().slice(start, end);
    });

    totalPages = computed(() =>
        Math.ceil(this.filteredProducts().length / this.itemsPerPage())
    );

    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
        }
    }

    updateSearchTerm(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchTerm.set(input.value)
    }

    addProduct() {
        this.router.navigate(['/product']);
    }

    editProduct(id: number) {
        this.router.navigate(['/product/edit', id]);
        sessionStorage.setItem('currentProduct', id.toString());
    }

    deleteProduct(productId: number) {
        this.productService.deleteProduct(productId.toString()).subscribe({
            next: (response) => {
                this.getAllProducts();
            },
            error: (error) => console.error('Error:', error)
        });
    }

    listTransactions() {
        this.router.navigate(['/transactions']);
    }

    async confirmDelete(productId: number, productName: string) {
        const confirmed = await this.confirm.show(
            'Confirmar eliminación', `¿Estás seguro de eliminar el producto ${productName}?`
        );
        if (confirmed) {
            this.deleteProduct(productId);
        }
    }
}
