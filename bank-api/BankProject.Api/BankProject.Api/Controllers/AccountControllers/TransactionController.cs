using BankProject.API.Contracts.Transaction.AddTransaction;
using BankProject.API.Contracts.Transaction.GetAllBillTransactions;
using BankProject.API.Contracts.Transaction.GetBillLastMonthTrs;
using BankProject.API.Contracts.Transaction.GetLastFive;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.API.Controllers.AccountControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionController : Controller
    {
        private readonly ITransactionService _transactionService;
        private readonly IBillService _billService;
        public TransactionController(ITransactionService transactionService, IBillService billService)
        {
            _transactionService = transactionService;
            _billService = billService;
        }

        [HttpPost("GetLastFive")]
        public async Task<ActionResult<GetLastFiveResponse>> GetLastFiveTransactions([FromBody] GetLastFiveRequest request)
        {
            var (transactions, error) = await _transactionService.GetLastFiveByBillUser(request.billId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetLastFiveResponse(transactions));
        }

        [HttpPost("AddBillBill")]
        public async Task<ActionResult<AddTransactionResponse>> AddBillBill([FromBody] AddTransactionRequest request)
        {
            var (transactionId, error) = await _transactionService.AddTransactionBillBill(request.bankAccountId, request.date, Guid.Empty, request.senderInf, Guid.Empty, request.receiverInf, request.amountOfMoney, Guid.Empty, "", "");

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddTransactionResponse(transactionId));
        }

        [HttpPost("AddBillCard")]
        public async Task<ActionResult<AddTransactionResponse>> AddBillCard([FromBody] AddTransactionRequest request)
        {
            var (transactionId, error) = await _transactionService.AddTransactionBillCard(request.bankAccountId, request.date, Guid.Empty, request.senderInf, Guid.Empty, "", request.amountOfMoney, Guid.Empty, request.receiverInf, "");

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddTransactionResponse(transactionId));
        }

        [HttpPost("AddCardBill")]
        public async Task<ActionResult<AddTransactionResponse>> AddCardBill([FromBody] AddTransactionRequest request)
        {
            var (transactionId, error) = await _transactionService.AddTransactionCardBill(request.bankAccountId, request.date, Guid.Empty, "", Guid.Empty, request.receiverInf, request.amountOfMoney, Guid.Empty, "", request.senderInf);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddTransactionResponse(transactionId));
        }

        [HttpPost("AddCardCard")]
        public async Task<ActionResult<AddTransactionResponse>> AddCardCard([FromBody] AddTransactionRequest request)
        {
            var (transactionId, error) = await _transactionService.AddTransactionCardCard(request.bankAccountId, request.date, Guid.Empty, "", Guid.Empty, "", request.amountOfMoney, Guid.Empty, request.receiverInf, request.senderInf);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddTransactionResponse(transactionId));
        }

        [HttpGet("GetAllAccountTransactions")]
        public async Task<ActionResult<GetAllAccountTransactionsResponse>> GetAllBillTransactions([FromQuery] Guid accountId)
        {
            if(accountId == Guid.Empty)
            {
                return BadRequest("Не указан Id");
            }
            var (bills, error) = await _billService.GetAllAccountBills(accountId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            var transactions = new List<TransactionUser>();

            foreach (var bill in bills)
            {
                var (transactionsFetched, errorTrs) = await _transactionService.GetAllTransactionsByBillUser(bill.BillId);

                if (errorTrs != "OK")
                {
                    return BadRequest(errorTrs);
                }

                transactions.AddRange(transactionsFetched);
            }

            return Ok(new GetAllAccountTransactionsResponse(transactions));
        }

        [HttpGet("GetLastMonth")]
        public async Task<ActionResult<GetLastMonthResponse>> GetLastMonth([FromQuery] Guid accountId)
        {
            var (bills, errorB) = await _billService.GetAllAccountBills(accountId);

            if (errorB != "OK")
            {
                return BadRequest(errorB);
            }

            List<GetBillLastMonthInf> inf = [];

            foreach (var bill in bills)
            {
                var (sP, s, rP, r, error) = await _transactionService.GetBillLastMonthTrsProcents(bill.BillId);

                if (error != "OK")
                {
                    return BadRequest(error);
                }

                inf.Add(new GetBillLastMonthInf(bill.BillNumber, sP, s, rP, r));
            }

            return Ok(new GetLastMonthResponse(inf));
        }
    }
}
