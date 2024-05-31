namespace BankProject.API.Contracts.Bill.AddBill
{
    public record AddBillRequest(
        Guid bankAccountId,
        string currency,
        string role,
        string purpose
        );
}
