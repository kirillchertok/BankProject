namespace BankProject.API.Contracts.Admin.GetAllCards
{
    public record GetAllCardsResponse(
        List<Core.Models.Card> cards
        );
}
