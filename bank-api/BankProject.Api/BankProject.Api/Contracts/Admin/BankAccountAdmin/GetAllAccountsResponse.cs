using BankProject.Core.Models;

namespace BankProject.API.Contracts.Admin.BankAccountAdmin
{
    public record GetAllAccountsResponse(
        List<BankAccount> accounts
        );
}
