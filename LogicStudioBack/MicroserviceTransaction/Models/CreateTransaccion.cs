namespace MicroserviceTransaction.Models
{
    public class CreateTransaccion
    {
        public string TransaccionTipo { get; set; }

        public int ProductoId { get; set; }

        public int Cantidad { get; set; }

        public decimal PrecioUnitario { get; set; }

        public decimal PrecioTotal { get; set; }

        public string TransaccionDetalle { get; set; }
    }
}
