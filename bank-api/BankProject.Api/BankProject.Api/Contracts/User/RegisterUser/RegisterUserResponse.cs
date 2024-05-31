namespace BankProject.API.Contracts.Users.RegisterUser
{
    public record RegisterUserResponse(
        Guid id,
        string role,
        Guid bankAccountId,
        string tokenA,
        string tokenR);
}