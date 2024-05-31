namespace BankProject.API.Contracts.Users.RefreshUser
{
    public record SendEmailResponse(
        Guid id,
        string code
        );
}
