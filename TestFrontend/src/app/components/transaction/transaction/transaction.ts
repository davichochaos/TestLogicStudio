import { UpdateProductInterface } from '@models/update-product';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductInterface } from '@models/product';
import { TransactionInterface } from '@models/transaction';
import { ProductService } from '@services/products/product';
import { TransacionService } from '@services/transactions/transacion';
import { AlertComponent } from '@modals/alert.component/alert.component';

@Component({
    selector: 'app-transaction',
    imports: [FormsModule, CommonModule, AlertComponent],
    templateUrl: './transaction.html',
    styleUrl: './transaction.css'
})
export class TransactionComponent {
    @ViewChild(AlertComponent) alert!: AlertComponent;
    private transactionService = inject(TransacionService);
    private productService = inject(ProductService);
    transaction: TransactionInterface = {
        cantidad: 1,
        precioTotal: 0,
        precioUnitario: 0,
        productoId: 0,
        transaccionDetalle: '',
        transaccionTipo: '',
        productoName: ''
    };
    updateStock: UpdateProductInterface = {
        productoCantidad: 0,
        productoId: 0,
        transaccionTipo: ''
    };
    formErrors = {
        idProducto: false,
        tipoTransaccion: false,
        detalle: false
    };
    products = signal<ProductInterface[]>([]);
    isUpdate = false;
    titulo = signal('');
    idProduct = signal(0);
    cantidad = signal(1);
    stock = signal(0);

    constructor(private router: Router) { }

    ngOnInit() {
        const idTransaction = sessionStorage.getItem('currentTransaction');
        this.getAllProducts();
        if (idTransaction) {
            this.getTransactionsById(idTransaction);
            sessionStorage.removeItem('currentTransaction');
            this.isUpdate = true;
            this.titulo.set('Edición de transacción');
        } else {
            this.isUpdate = false;
            this.titulo.set('Nueva transacción');
            //this.error = 'ID de producto no especificado';
            this.router.navigate(['/transaction']);
        }
    }

    saveTransaction() {
        this.formErrors.idProducto = !this.transaction.productoId;
        this.formErrors.detalle = !this.transaction.transaccionDetalle;
        this.formErrors.tipoTransaccion = !this.transaction.transaccionTipo;

        if (!this.formErrors.idProducto && !this.formErrors.detalle && !this.formErrors.tipoTransaccion) {
            if (this.preciotTotal() > 0) {
                this.transaction.precioTotal = this.preciotTotal();
            }

            if(this.transaction.precioUnitario == 0){
                this.transaction.precioUnitario = this.asignacionProducto();
            }

            this.updateStock.productoCantidad = this.transaction.cantidad;
            this.updateStock.productoId = this.transaction.productoId;
            this.updateStock.transaccionTipo = this.transaction.transaccionTipo;
            if(this.updateStock.transaccionTipo === 'Venta' && this.stock() < this.updateStock.productoCantidad){
                this.alert.show("Alerta stock", "La cantidad es mayor al stock del producto");
                return;
            }
            this.productService.updateProductStock(this.updateStock).subscribe({
                next: (response) => {
                    console.log('Stock actualizado');
                },
                error: (error) => {
                    console.error('Error al actualizar el stock:', error);
                }
            });

            if (this.isUpdate) {
                this.transactionService.updateTransactions(this.transaction).subscribe({
                    next: (response) => {
                        this.router.navigate(['/transactions']);
                    },
                    error: (error) => console.error('Error:', error)
                });
            }
            else {
                this.transactionService.createTransactions(this.transaction).subscribe({
                    next: (response) => {
                        this.router.navigate(['/transactions']);
                    },
                    error: (error) => console.error('Error:', error)
                });
            }
        }
    }

    getTransactionsById(idTransaction: string) {
        this.transactionService.getTransactionsById(idTransaction).subscribe({
            next: (response) => {
                this.transaction = response;
                console.log(response);
            },
            error: (error) => console.error('Error:', error)
        });
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

    asignacionProducto = computed(() => {
        const productId = this.idProduct();
        const product = this.products().find(p => p.productoId === productId);
        return product?.productoPrecio ?? 0;
    });

    updateProductId(event: Event) {
        const select = event.target as HTMLSelectElement;
        const product = this.products().find(p => p.productoId === Number(select.value));
        this.stock.set(product?.productoStock!);
        this.idProduct.set(Number(select.value))
    }

    updateCantidad(event: Event) {
        const input = event.target as HTMLInputElement;
        this.cantidad.set(Number(input.value));
    }

    preciotTotal = computed(() => {
        const cantidad = this.cantidad();
        const precioUnitario = this.asignacionProducto();
        console.log('cantidad', cantidad);
        console.log('precioUnitario', precioUnitario);
        if (isNaN(cantidad) || isNaN(precioUnitario)) {
            return 0;
        }
        return cantidad * precioUnitario;
    });

    cancelSave() {
        this.router.navigate(['/transactions']);
    }
}
