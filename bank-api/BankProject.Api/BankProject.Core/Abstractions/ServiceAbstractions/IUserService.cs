using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface IUserService
    {
        Task<User> CreateUser(User user);
        Task<Guid> DeleteUser(Guid id);
        public Task<User> GetOne(Guid userId);
        Task<List<User>> GetAllUsers();
        Task<Guid> UpdateUser(Guid id, string name, string secondname, string phoneNumber, string email, bool tfAuth, string passportNumber, string birthdayDate, string passportId);
    }
}