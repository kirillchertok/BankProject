using BankProject.API.Contracts.Admin.AddCreditValue;
using BankProject.API.Contracts.Admin.ApproveCredit;
using BankProject.API.Contracts.Admin.BankAccountAdmin;
using BankProject.API.Contracts.Admin.BankAccountAdmin.GetOne;
using BankProject.API.Contracts.Admin.BanUser;
using BankProject.API.Contracts.Admin.ChangeBalance;
using BankProject.API.Contracts.Admin.GetAllBills;
using BankProject.API.Contracts.Admin.GetAllCards;
using BankProject.API.Contracts.Admin.GetAllCredits;
using BankProject.API.Contracts.Admin.GetAllCreditValues;
using BankProject.API.Contracts.Admin.GetAllTransactions;
using BankProject.API.Contracts.Admin.GetMessages;
using BankProject.API.Contracts.Admin.UnBanUser;
using BankProject.API.Contracts.Admin.UserAdmin;
using BankProject.API.Contracts.Admin.UserAdmin.GetOne;
using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.Api.Controllers
{
    [Authorize(Roles = "admin")]
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly IUserService _userService;
        private readonly IBankAccountService _bankAccountService;
        private readonly IAdminMessageService _adminMessageService;
        private readonly ICreditService _creditService;
        private readonly ITransactionService _transactionService;
        private readonly ICardService _cardService;
        private readonly IBillService _billService;
        private readonly ICreditValueService _creditValueService;
        public AdminController(IUserService userService, IBankAccountService bankAccountService, IAdminMessageService adminMessageService, ICreditService creditService, ITransactionService transactionService, ICardService cardService, IBillService billService, ICreditValueService creditValueService)
        {
            _userService = userService;
            _bankAccountService = bankAccountService;
            _adminMessageService = adminMessageService;
            _creditService = creditService;
            _transactionService = transactionService;
            _cardService = cardService;
            _billService = billService;
            _creditValueService = creditValueService;
        }
        [HttpGet("allusers")]
        public async Task<ActionResult<List<UsersResponse>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();

            var response = users.Select(u => new UsersResponse(u.Id, u.Name, u.SecondName, u.PhoneNumber, u.Email, u.TfAuth, u.Role, u.PassportNumber, u.BirthdayDate, u.PassportId, u.Password));

            return Ok(response);
        }

        [HttpPost("oneuser")]
        public async Task<ActionResult<GetOneUserResponse>> GetOneById([FromBody] GetOneUserRequest request)
        {
            var users = await _userService.GetOne(request.userId);

            return Ok(users);
        }

        [HttpGet("allaccounts")]
        public async Task<ActionResult<GetAllAccountsResponse>> GetAllAccounts()
        {
            var (accounts, error) = await _bankAccountService.GetAllAccounts();

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(accounts);
        }

        [HttpPost("oneaccount")]
        public async Task<ActionResult<GetAllAccountsResponse>> GetOneAccount([FromBody] GetOneAccountRequest request)
        {
            var (account, error) = await _bankAccountService.GetAccountByUserId(request.userId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(account);
        }

        [HttpPost("banUser")]
        public async Task<ActionResult<BanUserResponse>> BanUser([FromBody] BanUserRequest request)
        {
            var (bankAccountId, error) = await _bankAccountService.BanAccountByUserId(request.userId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(bankAccountId);
        }

        [HttpPost("unBanUser")]
        public async Task<ActionResult<UnBanUserResponse>> UnBanUser([FromBody] UnBanUserRequest request)
        {
            var (bankAccountId, error) = await _bankAccountService.UnBanAccountByUserId(request.userId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(bankAccountId);
        }

        [HttpGet("GetMessages")]
        public async Task<ActionResult> GetMessages()
        {
            var (messages, error) = await _adminMessageService.GetAllMessages();

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetMessagesResponse(messages));
        }

        [HttpPatch("ApproveCredit")]
        public async Task<ActionResult> ApproveCredit([FromBody] ApproveCreditRequest request)
        {
            var (id, error) = await _creditService.ChangeCreditStatus(request.userId, request.messageId, request.creditId, true);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(id);
        }

        [HttpPatch("RejectCredit")]
        public async Task<ActionResult> RejectCredit([FromBody] ApproveCreditRequest request)
        {
            var (id, error) = await _creditService.ChangeCreditStatus(request.userId, request.messageId, request.creditId, false);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(id);
        }

        [HttpGet("GetAllCredits")]
        public async Task<ActionResult<GetAllCreditsResponse>> GetAllCredits()
        {
            var (credits, error) = await _creditService.GetAllCredits();

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetAllCreditsResponse(credits));
        }

        [HttpGet("GetAllTransactions")]
        public async Task<ActionResult<GetAllTransactionsResponse>> GetAllTransactions()
        {
            var (transactions, error) = await _transactionService.GetAllTransactions();

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetAllTransactionsResponse(transactions));
        }

        [HttpGet("GetAllCards")]
        public async Task<ActionResult<GetAllCardsResponse>> GetAllCards()
        {
            var (cards, error) = await _cardService.GetAllCards();

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetAllCardsResponse(cards));
        }

        [HttpGet("GetAllBills")]
        public async Task<ActionResult<GetAllBillsResponse>> GetAllBills()
        {
            var (bills, error) = await _billService.GetAllBills();

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new GetAllBillsResponse(bills));
        }

        [HttpPatch("AddMoney")]
        public async Task<ActionResult<ChangeBalanceResponse>> AddMoney([FromBody] ChangeBalanceRequest request)
        {
            var (id, error) = await _billService.AddMoneyToBill(request.billId, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new ChangeBalanceResponse(id));
        }

        [HttpPatch("RemoveMoney")]
        public async Task<ActionResult<ChangeBalanceResponse>> RemoveMoney([FromBody] ChangeBalanceRequest request)
        {
            var (id, error) = await _billService.RemoveMoneyFromBill(request.billId, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new ChangeBalanceResponse(id));
        }

        [HttpPatch("AddMoneyUnAllocated")]
        public async Task<ActionResult<ChangeBalanceResponse>> AddMoneyUnAllocated([FromBody] ChangeBalanceRequest request)
        {
            var (id, error) = await _billService.AddMoneyToBillUnAllocated(request.billId, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new ChangeBalanceResponse(id));
        }

        [HttpPatch("RemoveMoneyUnAllocated")]
        public async Task<ActionResult<ChangeBalanceResponse>> RemoveMoneyUnAllocated([FromBody] ChangeBalanceRequest request)
        {
            var (id, error) = await _billService.RemoveMoneyFromBillUnAllocated(request.billId, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new ChangeBalanceResponse(id));
        }

        [HttpPost("AddCreditValue")]
        public async Task<ActionResult<AddCreditValueResponse>> AddCreditValue([FromBody] AddCreditValueRequest request)
        {
            var (id, error) = await _creditValueService.AddCreditValue(request.currency, request.month, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddCreditValueResponse(id));
        }

        [HttpPut("UpdateCreditValue")]
        public async Task<ActionResult<AddCreditValueResponse>> UpdateCreditValue([FromBody] AddCreditValueRequest request)
        {
            var (id, error) = await _creditValueService.UpdateCreditValue(request.currency, request.month, request.amountOfMoney);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(new AddCreditValueResponse(id));
        }

        [HttpGet("GetAllCreditValues")]
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
