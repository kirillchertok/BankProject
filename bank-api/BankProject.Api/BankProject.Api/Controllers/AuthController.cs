using BankProject.API.Contracts.Users.LoginUser;
using BankProject.API.Contracts.Users.LogoutUser;
using BankProject.API.Contracts.Users.RefreshUser;
using BankProject.API.Contracts.Users.RegisterUser;
using BankProject.Application.Interfaces;
using BankProject.Application.Services;
using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace BankProject.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly IAuthService _authService;
        private readonly IBankAccountService _bankAccountService;
        private readonly IAdminMessageService _adminMessageService;
        private readonly IMailService _mailService;
        public AuthController(IAuthService authService, IBankAccountService bankAccountService, IAdminMessageService adminMessageService, IMailService mailService)
        {

            _authService = authService;
            _bankAccountService = bankAccountService;
            _adminMessageService = adminMessageService;
            _mailService = mailService;
        }

        [HttpPost("Register")]
        public async Task<ActionResult<RegisterUserResponse>> Register([FromBody] RegisterUserRequest request)
        {
            var (user, tokenA, tokenR) = await _authService.Register(
                request.name,
                request.secondname,
                request.phoneNumber,
                request.email,
                request.tfAuth,
                request.role,
                request.passportNumber,
                request.birthdayDate,
                request.passportId,
                request.password);

            if(tokenR == "Error")
            {
                return BadRequest(tokenA);
            }

            var (bankAccountId, error) = await _bankAccountService.CreateAccount(user.Id);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            Response.Cookies.Append("secret-cookie", tokenR, new Microsoft.AspNetCore.Http.CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(60),
                HttpOnly = true
            });

            return Ok(new RegisterUserResponse(user.Id, user.Role, bankAccountId, tokenA, tokenR));
        }

        [HttpPost("Login")]
        public async Task<ActionResult<LoginUserResponse>> Login([FromBody] LoginUserRequest request)
        {
            var (user, tokenA, tokenR) = await _authService.Login(request.phoneNumber,request.password);

            if(tokenR == "Error")
            {
                if(tokenA == "Пользователь заблокирован")
                {
                    return Ok(new LoginUserResponse(user.Id, user.Role, user.Id, tokenA, "ErrorBan"));
                }
                return BadRequest(tokenA);
            }

            var (bankAccount, error) = await _bankAccountService.GetAccountByUserId(user.Id);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            Response.Cookies.Append("secret-cookie", tokenR, new Microsoft.AspNetCore.Http.CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(60),
                HttpOnly = true
            });

            return Ok(new LoginUserResponse(user.Id, user.Role, bankAccount.BankAccountId, tokenA, tokenR));
        }

        [HttpPost("Logout")]
        public async Task<ActionResult<LogoutUserResponse>> Logout([FromBody] LogoutUserRequest request)
        {
            var Id = await _authService.Logout(request.id);

            Response.Cookies.Delete("secret-cookie");

            return Ok(new LogoutUserResponse(Id));
        }

        [HttpGet("Refresh")]
        public async Task<ActionResult<RefreshUserResponse>> Refresh()
        {
            var token = Request.Cookies["secret-cookie"];

#pragma warning disable CS8604 // Возможно, аргумент-ссылка, допускающий значение NULL.
            var (user, tokenA, tokenR) = await _authService.Refresh(token);
#pragma warning restore CS8604 // Возможно, аргумент-ссылка, допускающий значение NULL.

            var (bankAccount, error) = await _bankAccountService.GetAccountByUserId(user.Id);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            Response.Cookies.Append("secret-cookie", tokenR, new Microsoft.AspNetCore.Http.CookieOptions
            {
                Expires = DateTimeOffset.UtcNow.AddDays(60),
                HttpOnly = true
            });

            return Ok(new RefreshUserResponse(user.Id, user.Role, bankAccount.BankAccountId, tokenA, tokenR));
        }

        [HttpPost("AddUnbanMessage")]
        public async Task<ActionResult> AddUnbanMessage([FromQuery] Guid userId)
        {
            if (userId == Guid.Empty)
            {
                return BadRequest("Не указан ID пользователя");
            }

            var (id, error) = await _adminMessageService.CreateMessageToUnban(userId);

            if (error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(id);
        }
    }
}
