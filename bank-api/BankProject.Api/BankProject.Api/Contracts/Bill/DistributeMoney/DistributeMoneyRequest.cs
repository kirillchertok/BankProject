namespace BankProject.API.Contracts.Bill.DistributeMoney
{
    public record DistributeMoneyRequest(
        Guid billId,
        decimal amountOfMoney,
        string cardNumber
        );
}
