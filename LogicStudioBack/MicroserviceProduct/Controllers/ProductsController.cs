using MicroserviceProduct.Models;
using MicroserviceProduct.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MicroserviceProduct.Controllers
{
    [Route("api/v1/product")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductsService _service;
        private readonly logicStudioContext _context;

        public ProductsController(IProductsService service, logicStudioContext context)
        {
            _service = service;
            _context = context;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var producto = await _service.AllProducts();
            return Ok(producto);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromBody] CreateProducto model)
        {
            var producto = await _service.AddProduct(model);
            return Ok(producto);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] Producto model)
        {
            var producto = await _service.UpdateProduct(model);
            return Ok(producto);
        }

        [HttpDelete("delete/{productId}")]
        public async Task<IActionResult> Delete(int productId)
        {
            var producto = await _service.DeleteProduct(productId);
            if (producto == false)
                return NotFound();
            return NoContent();
        }

        [HttpPost("get-by-ids")]
        public IActionResult GetProductsByIds([FromBody] List<int>ids)
        {
            var products = _context.Productos.Where(p => ids.Contains(p.ProductoId)).Select(p => new ProductName
            {
                Id = p.ProductoId,
                NameProduct = p.ProductoNombre,
            }).ToList();
            return Ok(products);
        }

        [HttpGet("get-by-id/{productId}")]
        public async Task<IActionResult> GetProductById(int productId)
        {
            var producto = await _service.GetProductById(productId);
            if (producto == null)
                return NotFound();
            return Ok(producto);
        }

        [HttpPut("update-stock")]
        public async Task<IActionResult> UpdateStockProduct([FromBody] UpdateStock model)
        {
            var producto = await _service.UpdateStockProduct(model);
            return Ok(producto);
        }
    }
}
