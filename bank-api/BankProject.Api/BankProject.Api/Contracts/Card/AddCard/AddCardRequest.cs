namespace BankProject.API.Contracts.Card.AddCard
{
    public record AddCardRequest(
        Guid billId,
        string paymentSystem,
        string pinCode,
        string CVV,
        string color,
        string userName
        );
}
