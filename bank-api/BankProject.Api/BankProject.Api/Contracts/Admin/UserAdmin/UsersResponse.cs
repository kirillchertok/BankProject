namespace BankProject.API.Contracts.Admin.UserAdmin
{
    public record UsersResponse(
        Guid id,
        string name,
        string secondname,
        string phoneNumber,
        string email,
        bool tfAuth,
        string role,
        string passportNumber,
        string birthdayDate,
        string passportId,
        string password);
}
