using System.ComponentModel.DataAnnotations;

namespace BankProject.API.Contracts.Users.LoginUser
{
    public record LoginUserRequest(
       [Required] string phoneNumber,
       [Required] string password);
}
