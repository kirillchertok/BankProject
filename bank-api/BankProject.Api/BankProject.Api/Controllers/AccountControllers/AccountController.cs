using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BankProject.Core.Models;
using BankProject.API.Contracts.Account;

namespace BankProject.API.Controllers.AccountControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IBillService _billService;
        private readonly ICardService _cardService;
        private readonly ICreditService _creditService;
        private readonly IUserService _userService;
        private readonly ITransactionService _transactionService;
        private readonly IBankAccountService _bankAccountService;
        private readonly IAdminMessageService _adminMessageService;
        public AccountController(
            IBillService billService, 
            ICardService cardService, 
            ICreditService creditService, 
            IUserService userService,
            ITransactionService transactionService,
            IBankAccountService bankAccountService,
            IAdminMessageService adminMessageService)
        {
            _billService = billService;
            _creditService = creditService;
            _cardService = cardService;
            _userService = userService;
            _transactionService = transactionService;
            _bankAccountService = bankAccountService;
            _adminMessageService = adminMessageService;
        }

        [HttpGet("getAllData")]
        public async Task<ActionResult<GetAllAccountDataResponse>> GetAllData([FromQuery] Guid accountId)
        {
            //if (string.IsNullOrEmpty(Request.Query["accountId"].ToString()))
            //{
            //    return BadRequest("Не указан Id аккаунта");
            //}

            //var accountId = Guid.Parse(Request.Query["accountId"].ToString());

            //if (string.IsNullOrEmpty(accountIdRequest))
            //{
            //    return BadRequest("Не указан Id аккаунта");
            //}

            //var accountId = Guid.Parse(accountIdRequest);

            if(accountId == Guid.Empty)
            {
                return BadRequest("Не указан Id аккаунта");
            }

            var (bills, error) = await _billService.GetAllAccountBills(accountId);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            var billsData = new List<BillData>();

            foreach (var bill in bills)
            {
                var (cards, errorCards) = await _cardService.GetAllBillCards(bill.BillId);

                if(errorCards != "OK")
                {
                    return BadRequest(errorCards);
                }

                var (credits, errorCredits) = await _creditService.GetAllCreditsByBill(bill.BillId);

                if (errorCredits != "OK")
                {
                    return BadRequest(errorCredits);
                }

                billsData.Add(new BillData(bill, cards, credits));
            }

            return Ok(new GetAllAccountDataResponse(billsData));
        }

        [HttpGet("getTrsBillsData")]
        public async Task<ActionResult<GetTrsBillsDataResponse>> GetTrsBillsData([FromQuery] Guid accountId)
        {
            if (accountId == Guid.Empty)
            {
                return BadRequest("Не указан Id аккаунта");
            }

            var (bills, error) = await _billService.GetAllAccountBills(accountId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            var billsData = new List<TrsBillsData>();

            foreach (var bill in bills)
            {
                var (transactions, errorTrs) = await _transactionService.GetLastFiveByBillUser(bill.BillId);

                if (errorTrs != "OK")
                {
                    return BadRequest(errorTrs);
                }

                billsData.Add(new TrsBillsData(bill, transactions));
            }

            return Ok(new GetTrsBillsDataResponse(billsData));
        }

        [HttpGet("getFullName")]
        public async Task<ActionResult<GetUserFullNameResponse>> GetUserFullName([FromQuery] Guid userId)
        {
            if(userId == Guid.Empty)
            {
                return BadRequest("Не указан Id пользователя");
            }

            var user = await _userService.GetOne(userId);

            if(user == null)
            {
                return BadRequest("Пользователь не найден");
            }

            return Ok(new GetUserFullNameResponse(user.Name, user.SecondName));
        }

        [HttpGet("CheckBan")]
        public async Task<ActionResult<CheckBanResponse>> CheckBan([FromQuery] Guid userId)
        {
            if(userId == Guid.Empty)
            {
                return BadRequest("Не указан ID пользователя");
            }

            var ban = await _bankAccountService.CheckBan(userId);

            return Ok(ban);
        }
    }
}
