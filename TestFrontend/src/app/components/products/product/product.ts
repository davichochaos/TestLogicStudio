import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductInterface } from '@models/product';
import { ProductService } from '@services/products/product';

@Component({
	selector: 'app-product',
	imports: [FormsModule, CommonModule],
	templateUrl: './product.html',
	styleUrl: './product.css'
})
export class ProductComponent {
	private productService = inject(ProductService);
	product: ProductInterface = {
		productoNombre: '',
		productoDescripcion: '',
		productoImagen: '',
		productoCategoria: '',
		productoPrecio: 0,
		productoStock: 0
	};
	isUpdate = false;
	titulo = signal('');
	formErrors = {
		productoNombre: false,
		productoDescripcion: false,
		productoImagen: false,
		productoCategoria: false,
		productoPrecio: false,
		productoStock: false
	};

	constructor(private router: Router) { }

	ngOnInit() {
		const idProduct = sessionStorage.getItem('currentProduct');
		if (idProduct) {
			this.getProductById(idProduct);
			sessionStorage.removeItem('currentProduct');
			this.isUpdate = true;
			this.titulo.set('Edición de producto');
		} else {
			this.isUpdate = false;
			this.titulo.set('Nuevo producto');
			//this.error = 'ID de producto no especificado';
			this.router.navigate(['/product']);
		}
	}

	saveProduct() {
		this.formErrors.productoCategoria = !this.product.productoCategoria;
		this.formErrors.productoDescripcion = !this.product.productoDescripcion;
		this.formErrors.productoImagen = !this.product.productoImagen;
		this.formErrors.productoNombre = !this.product.productoNombre;
		this.formErrors.productoPrecio = !this.product.productoPrecio;
		this.formErrors.productoStock = !this.product.productoStock;

		if (!this.formErrors.productoCategoria && !this.formErrors.productoDescripcion && !this.formErrors.productoImagen && !this.formErrors.productoNombre && !this.formErrors.productoPrecio && !this.formErrors.productoStock) {
			if (this.isUpdate) {
				this.productService.updateProduct(this.product).subscribe({
					next: (response) => {
						this.router.navigate(['']);
					},
					error: (error) => console.error('Error:', error)
				});
			}
			else {
				this.productService.createProduct(this.product).subscribe({
					next: (response) => {
						this.router.navigate(['']);
					},
					error: (error) => console.error('Error:', error)
				});
			}
		}
	}

	getProductById(idProduct: string) {
		this.productService.getProductById(idProduct).subscribe({
			next: (response) => {
				this.product = response;
				console.log(response);
			},
			error: (error) => console.error('Error:', error)
		});
	}

	cancelSave() {
		this.router.navigate(['']);
	}
}
