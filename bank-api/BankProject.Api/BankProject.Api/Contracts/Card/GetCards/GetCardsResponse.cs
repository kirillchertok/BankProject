using BankProject.Core.Models;

namespace BankProject.API.Contracts.Card.GetCards
{
    public record GetCardsResponse(
        List<BankProject.Core.Models.Card> cards
        );
}
