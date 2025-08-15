using MicroserviceTransaction.Models;

namespace MicroserviceTransaction.Services
{
    public interface ITransactionsService
    {
        Task<List<TransactionName>> AllTransactions();
        Task<Transaccion> AddTransaction(CreateTransaccion model);
        Task<Transaccion> UpdateTransaction(Transaccion model);
        Task<Transaccion?> GetTransactionById(int productId);
        Task<bool> DeleteTransaction(int productId);
    }
}
