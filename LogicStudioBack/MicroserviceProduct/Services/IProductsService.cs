using MicroserviceProduct.Models;

namespace MicroserviceProduct.Services
{
    public interface IProductsService
    {
        Task<List<Producto>> AllProducts();
        Task<Producto> AddProduct(CreateProducto model);
        Task<Producto> UpdateProduct(Producto model);
        Task<Producto?> GetProductById(int productId);
        Task<bool> DeleteProduct(int productId);
        Task<Producto?> UpdateStockProduct(UpdateStock model);
    }
}
