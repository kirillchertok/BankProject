namespace BankProject.API.Contracts.Transaction.GetAllBillTransactions
{
    public record GetAllAccountTransactionsResponse(
        List<Core.Models.TransactionUser> transactions
        );
}
