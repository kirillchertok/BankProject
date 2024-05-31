namespace BankProject.API.Contracts.Admin.ChangeBalance
{
    public record ChangeBalanceRequest(
        Guid billId,
        decimal amountOfMoney
        );
}
