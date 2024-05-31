using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface IUserRepository
    {
        Task<User> Add(User user);
        Task<Guid> Delete(Guid id);
        Task<List<User>> Get();
        public Task<User> GetOne(Guid userId);
        Task<Guid> Update(Guid id, string name, string secondname, string phoneNumber, string email, bool tfAuth, string passportNumber, string birthdayDate, string passportId);
        Task<User> GetByPhoneNumber(string phoneNumber);
        Task<bool> CheckIsExist(string phoneNumber);
        Task<User> GetById(Guid id);
        Task<Guid> UpdateToken(Guid id, string token);
        Task<Guid> DeleteToken(Guid id);
        Task<User?> FindToken(string token);
    }
}
