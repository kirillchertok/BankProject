namespace BankProject.API.Contracts.Admin.GetAllTransactions
{
    public record GetAllTransactionsResponse(
        List<Core.Models.TransactionAdmin> transactions
        );
}
