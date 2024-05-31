namespace BankProject.API.Contracts.Admin.AddCreditValue
{
    public record AddCreditValueRequest(
        string currency,
        int month,
        decimal amountOfMoney
        );
}
