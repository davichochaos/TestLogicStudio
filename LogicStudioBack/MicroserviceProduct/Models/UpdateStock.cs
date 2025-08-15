namespace MicroserviceProduct.Models
{
    public class UpdateStock
    {
        public int ProductoId { get; set; }
        public int ProductoCantidad { get; set; }
        public string TransaccionTipo { get; set; }
    }
}
