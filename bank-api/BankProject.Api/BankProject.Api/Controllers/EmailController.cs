using BankProject.API.Contracts.Users.LoginUser;
using BankProject.API.Contracts.Users.RefreshUser;
using BankProject.Application.Interfaces;
using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmailController : Controller
    {
        public readonly IMailService _mailService;
        private readonly IAuthService _authService;
        public EmailController(IMailService mailService, IAuthService authService)
        {
            _mailService = mailService;
            _authService = authService;
        }

        [HttpPost("SendEmail")]
        public async Task<ActionResult<SendEmailResponse>> SendEmail([FromBody] SendEmailRequest request)
        {
            var (user, tokenA, tokenR) = await _authService.Login(request.phoneNumber, request.password);

            if (tokenR == "Error")
            {
                if (tokenA == "Пользователь заблокирован")
                {
                    return Ok(new SendEmailResponse(user.Id, "ErrorBan"));
                }
                return BadRequest(tokenA);
            }

            var code = await _mailService.SendAuthMail(user.Id);

            if(code == "Не нужно")
            {
                return Ok(new SendEmailResponse(user.Id, code));
            }

            int tmp;

            try
            {
                tmp = Convert.ToInt32(code);
                return Ok(new SendEmailResponse(user.Id, code));
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return BadRequest(ex.Message);
            }
        }
    }
}
