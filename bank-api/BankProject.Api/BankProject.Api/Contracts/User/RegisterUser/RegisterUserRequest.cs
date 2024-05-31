using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace BankProject.API.Contracts.Users.RegisterUser
{
    public record RegisterUserRequest(
      [Required] string name,
      [Required] string secondname,
      [Required] string phoneNumber,
      [Required] string email,
      [Required] bool tfAuth,
      [Required] string role,
      [Required] string passportNumber,
      [Required] string birthdayDate,
      [Required] string passportId,
      [Required] string password);
}
