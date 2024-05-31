namespace BankProject.API.Contracts.Users.RefreshUser
{
    public record SendEmailRequest(
        string phoneNumber,
        string password
        );
}