using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;

namespace BankProject.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        public UserService(IUserRepository usersRepository)
        {
            _userRepository = usersRepository;
        }
        public async Task<List<User>> GetAllUsers()
        {
            return await _userRepository.Get();
        }
        public async Task<User> CreateUser(User user)
        {
            return await _userRepository.Add(user);
        }
        public async Task<User> GetOne(Guid userId)
        {
            try
            {
                var user = await _userRepository.GetOne(userId);

                return user;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new User());
            }
        }
        public async Task<Guid> UpdateUser(Guid id, string name, string secondname, string phoneNumber, string email, bool tfAuth, string passportNumber, string birthdayDate, string passportId)
        {
            return await _userRepository.Update(id, name, secondname, phoneNumber, email, tfAuth, passportNumber, birthdayDate, passportId);
        }
        public async Task<Guid> DeleteUser(Guid id)
        {
            return await _userRepository.Delete(id);
        }
    }
}
