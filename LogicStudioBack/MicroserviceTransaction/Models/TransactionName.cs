namespace MicroserviceTransaction.Models
{
    public class TransactionName
    {
        public int TransaccionId { get; set; }
        public DateTime TransaccionFecha { get; set; }
        public string TransaccionTipo { get; set; }
        public string ProductoName { get; set; }
        public int Cantidad { get; set; }
        public decimal PrecioUnitario { get; set; }
        public decimal PrecioTotal { get; set; }
        public string TransaccionDetalle { get; set; }
    }
}
