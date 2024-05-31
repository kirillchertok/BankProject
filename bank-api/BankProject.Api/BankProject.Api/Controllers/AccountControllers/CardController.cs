using BankProject.API.Contracts.Card.AddCard;
using BankProject.API.Contracts.Card.GetCards;
using BankProject.Core.Abstractions.ServiceAbstractions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.API.Controllers.AccountControllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : Controller
    {
        private readonly ICardService _cardService;
        public CardController(ICardService cardService)
        {
            _cardService = cardService;
        }

        [HttpPost("GetCards")]
        public async Task<ActionResult<GetCardsResponse>> GetUserCards([FromBody] GetCardsRequest request)
        {
            var (cards, error) = await _cardService.GetAllBillCards(request.billId);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(cards);
        }
        [HttpPost("AddCard")]
        public async Task<ActionResult<AddCardResponse>> AddCard([FromBody] AddCardRequest request)
        {
            var (cardNumber, error) = await _cardService.AddCard(request.billId, request.paymentSystem, request.pinCode, request.CVV, request.color, request.userName);

            if(error != "OK")
            {
                return BadRequest(error);
            }

            return Ok(cardNumber);
        }
    }
}
