namespace BankProject.API.Contracts.Credit.UpdateDept
{
    public record UpdatePaymentRequest(
        Guid billId,
        Guid creditId,
        decimal amountOfMoney,
        string cardNumber,
        string type
        );
}
