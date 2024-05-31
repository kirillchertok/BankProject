using BankProject.Core.Models;

namespace BankProject.API.Contracts.Admin.UserAdmin.GetOne
{
    public record GetOneUserResponse(
        BankAccount bankAccount
        );
}
