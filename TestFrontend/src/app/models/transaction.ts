export interface TransactionInterface {
    transaccionId?: number;
    transaccionFecha?: Date | string;
    transaccionTipo: string;
    productoId: number;
    productoName?: string;
    cantidad: number;
    precioUnitario: number;
    precioTotal: number;
    transaccionDetalle: string;
}
