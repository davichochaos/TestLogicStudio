import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmComponent } from '@modals/confirm.component/confirm.component';
import { TransactionInterface } from '@models/transaction';
import { TransacionService } from '@services/transactions/transacion';

@Component({
    selector: 'app-list-transaction',
    imports: [CommonModule, ConfirmComponent],
    templateUrl: './list-transaction.html',
    styleUrl: './list-transaction.css'
})
export class ListTransactionComponent {
    @ViewChild(ConfirmComponent) confirm!: ConfirmComponent;
    private transactionService = inject(TransacionService);
    searchTerm = signal('');
    itemsPerPage = signal(5);
    currentPage = signal(1);
    transaction = signal<TransactionInterface[]>([]);

    constructor(private router: Router) { }

    ngOnInit() {
        this.getAllTransactions();
    }

    getAllTransactions() {
        this.transactionService.getAllTransactions().subscribe({
            next: (response) => {
                const productsArray = response || [];
                this.transaction.set(productsArray);
            },
            error: (err) => {
                console.error('Error loading products:', err);
                this.transaction.set([]);
            },
        });
    }

    paginatedTransactions = computed(() => {
        const start = (this.currentPage() - 1) * this.itemsPerPage();
        const end = start + this.itemsPerPage();
        return this.filteredTransactions().slice(start, end);
    });

    filteredTransactions = computed(() => {
        const term = this.searchTerm().toLowerCase().trim();
        if (!term) return this.transaction();

        return this.transaction().filter(transaction => {
            const fecha = new Date(transaction.transaccionFecha!).toLocaleString('es-ES');

            return transaction.transaccionTipo.toLowerCase().includes(term) ||
                fecha.includes(term);
        });
    });

    totalPages = computed(() =>
        Math.ceil(this.filteredTransactions().length / this.itemsPerPage())
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

    addTransaction() {
        this.router.navigate(['/transaction']);
    }

    editTransaction(id: number) {
        this.router.navigate(['/transaction/edit', id]);
        sessionStorage.setItem('currentTransaction', id.toString());
    }

    deleteTransaction(productId: number) {
        this.transactionService.deleteTransactions(productId.toString()).subscribe({
            next: (response) => {
                this.getAllTransactions();
            },
            error: (error) => console.error('Error:', error)
        });
    }

    listProducts() {
        this.router.navigate(['']);
    }

    async confirmDelete(transactionId: number) {
        const confirmed = await this.confirm.show(
            'Confirmar eliminación', `¿Estás seguro de eliminar la transacción?`
        );
        if (confirmed) {
            this.deleteTransaction(transactionId);
        }
    }
}
