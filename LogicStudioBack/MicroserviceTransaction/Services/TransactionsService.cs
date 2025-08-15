using MicroserviceProduct.Models;
using MicroserviceTransaction.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace MicroserviceTransaction.Services
{
    public class TransactionsService : ITransactionsService
    {
        private readonly logicStudioContext _context;
        private readonly DbSet<Transaccion> _dbSet;
        private readonly HttpClient _httpClient;

        public TransactionsService(logicStudioContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _dbSet = _context.Set<Transaccion>();
            _httpClient = httpClientFactory.CreateClient("ProductService");
        }
        public async Task<Transaccion> AddTransaction(CreateTransaccion model)
        {
            var newTransaction = new Transaccion
            {
                Cantidad = model.Cantidad,
                PrecioTotal = model.PrecioTotal,
                PrecioUnitario = model.PrecioUnitario,
                ProductoId = model.ProductoId,
                TransaccionDetalle = model.TransaccionDetalle,
                TransaccionFecha = DateTime.Now,
                TransaccionTipo = model.TransaccionTipo
            };
            await _context.Transaccions.AddAsync(newTransaction);
            await _context.SaveChangesAsync();
            return newTransaction;
        }

        public async Task<List<TransactionName>> AllTransactions()
        {
            var transactions = await _context.Transaccions.ToListAsync();
            var productoIds = transactions.Select(t => t.ProductoId).Distinct().ToList();
            var content = new StringContent(JsonSerializer.Serialize(productoIds), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync("api/v1/product/get-by-ids", content);
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("Error al obtener productos desde el microservicio de productos");
            }
            var responseContent = await response.Content.ReadAsStringAsync();
            var productos = JsonSerializer.Deserialize<List<ProductName>>(responseContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            var transactionName = transactions.Select(t =>
            {
                var prod = productos.FirstOrDefault(p => p.Id == t.ProductoId);
                return new TransactionName
                {
                    Cantidad = t.Cantidad,
                    PrecioTotal = t.PrecioTotal,
                    PrecioUnitario = t.PrecioUnitario,
                    ProductoName = prod.NameProduct,
                    TransaccionDetalle = t.TransaccionDetalle,
                    TransaccionFecha = t.TransaccionFecha,
                    TransaccionId = t.TransaccionId,
                    TransaccionTipo = t.TransaccionTipo,

                };
            }).ToList();

            return transactionName;
        }

        public async Task<bool> DeleteTransaction(int transactionId)
        {
            var transaction = await _context.Transaccions.FindAsync(transactionId);
            if (transaction == null)
            {
                return false;
            }
            _context.Transaccions.Remove(transaction);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Transaccion> UpdateTransaction(Transaccion model)
        {
            _context.Transaccions.Update(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<Transaccion?> GetTransactionById(int transactionId)
        {
            var product = await _context.Transaccions.FindAsync(transactionId);
            return product;
        }
    }
}
