using BankProject.Core.Models;

namespace BankProject.API.Contracts.Transaction.GetLastFive
{
    public record GetLastFiveResponse(
        List<TransactionUser> transactions
        );
}
