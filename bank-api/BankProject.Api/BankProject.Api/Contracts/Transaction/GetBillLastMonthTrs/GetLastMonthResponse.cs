namespace BankProject.API.Contracts.Transaction.GetBillLastMonthTrs
{
    public record GetLastMonthResponse(
        List<GetBillLastMonthInf> lastMonthInf
        );
}
