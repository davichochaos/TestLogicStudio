import { Routes } from '@angular/router';
import { ListProductComponent } from '@products/list-product/list-product';
import { ProductComponent } from '@products/product/product';
import { ListTransactionComponent } from '@transactions/list-transaction/list-transaction';
import { TransactionComponent } from '@transactions/transaction/transaction';

export const routes: Routes = [
    {
        path: '',
        component: ListProductComponent
    },
    {
        path: 'product',
        component: ProductComponent,
        children: [
            {
                path: 'edit/:id',
                component: ProductComponent
            }
        ]
    },
    {
        path: 'transactions',
        component: ListTransactionComponent
    },
    {
        path: 'transaction',
        component: TransactionComponent,
        children: [
            {
                path: 'edit/:id',
                component: TransactionComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
