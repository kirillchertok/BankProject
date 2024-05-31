using BankProject.Core.Models;

namespace BankProject.API.Contracts.Bill.UserBills
{
    public record UserBillsResponse(
        List<BankProject.Core.Models.Bill> Bills
        );
}
