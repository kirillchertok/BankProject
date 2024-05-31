using BankProject.Core.Models;

namespace BankProject.API.Contracts.Account
{
    public record GetAllAccountDataResponse(
        List<BillData> billsData
    );
}
