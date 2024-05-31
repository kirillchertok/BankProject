namespace BankProject.API.Contracts.Transaction.AddTransaction
{
    public record AddTransactionRequest(
        Guid bankAccountId,
        string date,
        string senderInf,
        string receiverInf,
        decimal amountOfMoney
        );
}
