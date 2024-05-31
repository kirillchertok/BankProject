namespace BankProject.API.Contracts.Users.RefreshUser
{
    public record RefreshUserResponse(
        Guid id,
        string role,
        Guid bankAccountId,
        string tokenA,
        string tokenR);
}