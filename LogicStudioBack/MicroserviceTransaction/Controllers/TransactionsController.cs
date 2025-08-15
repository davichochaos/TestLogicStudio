using MicroserviceTransaction.Models;
using MicroserviceTransaction.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MicroserviceTransaction.Controllers
{
    [Route("api/v1/transaction")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionsService _service;

        public TransactionsController(ITransactionsService service)
        {
            _service = service;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var transaccion = await _service.AllTransactions();
            return Ok(transaccion);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Create([FromBody] CreateTransaccion model)
        {
            var producto = await _service.AddTransaction(model);
            return Ok(producto);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] Transaccion model)
        {
            var producto = await _service.UpdateTransaction(model);
            return Ok(producto);
        }

        [HttpDelete("delete/{transaccionId}")]
        public async Task<IActionResult> Delete(int transaccionId)
        {
            var transaccion = await _service.DeleteTransaction(transaccionId);
            if (transaccion == false)
                return NotFound();
            return NoContent();
        }

        [HttpGet("get-by-id/{transaccionId}")]
        public async Task<IActionResult> GetTransactionById(int transaccionId)
        {
            var producto = await _service.GetTransactionById(transaccionId);
            if (producto == null)
                return NotFound();
            return Ok(producto);
        }
    }
}
