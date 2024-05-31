namespace BankProject.API.Contracts.Users.LoginUser
{
    public record LoginUserResponse(
        Guid id,
        string role,
        Guid bankAccountId,
        string tokenA,
        string tokenR);
}