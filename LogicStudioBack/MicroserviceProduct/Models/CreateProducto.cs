namespace MicroserviceProduct.Models
{
    public class CreateProducto
    {
        public string ProductoNombre { get; set; }
        public string ProductoDescripcion { get; set; }
        public string ProductoCategoria { get; set; }
        public string ProductoImagen { get; set; }
        public decimal ProductoPrecio { get; set; }
        public int ProductoStock { get; set; }
    }
}
