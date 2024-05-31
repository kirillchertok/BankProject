namespace BankProject.API.Contracts.Transaction.GetBillLastMonthTrs
{
    public record GetBillLastMonthInf(
        string billNumber,
        decimal procentSend,
        decimal sended,
        decimal procentReceive,
        decimal received
        );
}
