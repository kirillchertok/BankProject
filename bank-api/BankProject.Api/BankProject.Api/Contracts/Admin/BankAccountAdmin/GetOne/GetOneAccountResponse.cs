using BankProject.Core.Models;

namespace BankProject.API.Contracts.Admin.BankAccountAdmin.GetOne
{
    public record GetOneAccountResponse(
        BankAccount bankAccount
        );
}
