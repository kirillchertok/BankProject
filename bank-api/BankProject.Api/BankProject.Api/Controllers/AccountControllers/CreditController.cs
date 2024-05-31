using BankProject.API.Contracts.Admin.GetAllCreditValues;
using BankProject.API.Contracts.Credit.GetAllUserCredits;
using BankProject.API.Contracts.Credit.GetOne;
using BankProject.API.Contracts.Credit.TryGet;
using BankProject.API.Contracts.Credit.UpdateApplication;
using BankProject.API.Contracts.Credit.UpdateDept;
using BankProject.Application.Services;
using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.API.Controllers.AccountControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CreditController : Controller
    {
        private readonly ICreditService _creditService;
        private readonly IBillService _billService;
        private readonly ICreditValueService _creditValueService;
        public CreditController(ICreditService creditService, IBillService billService, ICreditValueService creditValueService)
        {
            _creditService = creditService;
            _billService = billService;
            _creditValueService = creditValueService;
        }

        [HttpGet("GetAllUserCredits")]
        public async Task<ActionResult<GetAllUserCreditsResponse>> GetAllUserCredits([FromQuery] Guid accountId)
        {
            if(accountId == Guid.Empty)
            {
                return BadRequest("Не указан Id аккаунта");
            }

            var (bills, error) = await _billService.GetAllAccountBills(accountId);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            var billsCreditsData = new List<BillsCreditModel>();

            foreach (var bill in bills)
            {
                var (credits, errorCredits) = await _creditService.GetAllCreditsByBill(bill.BillId);

                if(error != "OK")
                {
                    return BadRequest(errorCredits);
                }

                billsCreditsData.Add(new BillsCreditModel(bill, credits));
            }

            return Ok(billsCreditsData);
        }

        [HttpPost("TryCredit")]
        public async Task<ActionResult<TryGetResponse>> TryCredit([FromBody] TryGetRequest response)
        {
            var (credit, error) = await _creditService.TryAdd(response.billId, response.userId, response.dateStart, response.monthToPay, response.amountOfMoney, response.procents, response.salary);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(credit);
        }

        [HttpPatch("UpdatePayment")]
        public async Task<ActionResult> UpdatePayment([FromBody] UpdatePaymentRequest request)
        {
            var (id, error) = await _creditService.UpdateCreditPayment(request.billId, request.creditId, request.amountOfMoney, request.cardNumber, request.type);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(id);
        }

        [HttpPut("UpdateCreditApplicationInf")]
        public async Task<ActionResult> UpdateCreditApplicationInf([FromBody] UpdateApplicationRequest request)
        {
            var (id, error) = await _creditService.UpdateApplicationInf(request.creditId, request.dateStart, request.monthToPay, request.amountOfMoney, request.procents);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(id);
        }

        [HttpGet("GetOneCreditById")]
        public async Task<ActionResult<GetOneCreditResponse>> GetOneCreditById([FromQuery] Guid creditId)
        {
            var (credit, error) = await _creditService.GetOneCreditById(creditId);

            if (error != "OK")
            {
                return Ok(error);
            }

            return Ok(new GetOneCreditResponse(credit));
        }

        [HttpGet("GetAllCreditValuesUser")]
        public async Task<ActionResult<GetAllCreditValuesResponse>> GetAllCreditValues()
        {
            var (creditValues, error) = await _creditValueService.GetAllCreditValues();

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetAllCreditValuesResponse(creditValues));
        }
    }
}
