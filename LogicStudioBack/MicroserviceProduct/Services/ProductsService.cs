using MicroserviceProduct.Models;
using Microsoft.EntityFrameworkCore;

namespace MicroserviceProduct.Services
{
    public class ProductsService : IProductsService
    {
        private readonly logicStudioContext _context;
        private readonly DbSet<Producto> _dbSet;
        public ProductsService(logicStudioContext context)
        {
            _context = context;
            _dbSet = _context.Set<Producto>();
        }

        public async Task<Producto> AddProduct(CreateProducto model)
        {
            var newProduct = new Producto
            {
                ProductoCategoria = model.ProductoCategoria,
                ProductoDescripcion = model.ProductoDescripcion,
                ProductoImagen = model.ProductoImagen,
                ProductoNombre = model.ProductoNombre,
                ProductoPrecio = model.ProductoPrecio,
                ProductoStock = model.ProductoStock,
            };
            await _context.Productos.AddAsync(newProduct);
            await _context.SaveChangesAsync();
            return newProduct;
        }

        public async Task<List<Producto>> AllProducts()
        {
            return await _dbSet.ToListAsync();
        }

        public async Task<bool> DeleteProduct(int productId)
        {
            var product = await _context.Productos.FindAsync(productId);
            if (product == null) 
            {
                return false;
            }
            _context.Productos.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Producto> UpdateProduct(Producto model)
        {
            _context.Productos.Update(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<Producto?> GetProductById(int productId)
        {
            var product = await _context.Productos.FindAsync(productId);
            return product;
        }

        public async Task<Producto?> UpdateStockProduct(UpdateStock model)
        {
            var product = await _context.Productos.FindAsync(model.ProductoId);
            if (model.TransaccionTipo == "Compra")
            {
                product!.ProductoStock = product.ProductoStock + model.ProductoCantidad;
            }
            else
            {
                product!.ProductoStock = product.ProductoStock - model.ProductoCantidad;
            }
            _context.Productos.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }
    }
}
