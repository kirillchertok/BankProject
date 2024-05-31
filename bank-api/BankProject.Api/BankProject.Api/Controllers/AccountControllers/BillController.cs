using BankProject.API.Contracts.Bill.AddBill;
using BankProject.API.Contracts.Bill.DistributeMoney;
using BankProject.API.Contracts.Bill.UserBills;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.API.Controllers.AccountControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BillController : Controller
    {
        private readonly IBillService _billService;
        public BillController(IBillService billService)
        {
            _billService = billService;
        }

        [HttpPost("GetBills")]
        public async Task<ActionResult<UserBillsResponse>> GetUserBills([FromBody] UserBillsRequest request)
        {
            var (bills, error) = await _billService.GetAllAccountBills(request.bankAccountId);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(bills);
        }
        [HttpPost("AddBill")]
        public async Task<ActionResult<AddBillResponse>> AddBill([FromBody] AddBillRequest request)
        {
            var (billId, error) = await _billService.AddBill(request.bankAccountId, request.currency, request.role, request.purpose);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddBillResponse(billId));
        }
        [HttpPost("DistributeMoney")]
        public async Task<ActionResult> DistributeMoney([FromBody] DistributeMoneyRequest request)
        {
            var (id, error) = await _billService.AddUnAllocatedMoney(request.billId, request.amountOfMoney, request.cardNumber);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok();
        }
    }
}
