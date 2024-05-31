using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface IAuthService
    {
        public Task<(User, string, string)> Register(
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
        public Task<(User, string, string)> Login(
            string phoneNumber,
            string password);
        public Task<Guid> Logout(Guid id);
        public Task<(User, string, string)> Refresh(string token);
        public Task<(Guid, bool, string)> CheckUserTfAuth(string phoneNumber);
    }
}
