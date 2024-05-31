using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly BankProjectDbContext _db;
        public UserRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<List<User>> Get()
        {
            var userEntities = await _db.Users
                .AsNoTracking()
                .ToListAsync();

            var users = userEntities
                .Select(u => User.Create(u.UserId, u.Name, u.SecondName, u.PhoneNumber, u.Email, u.TfAuth, u.Role, u.PassportNumber, u.BirthdayDate, u.PassportId, u.Password))
                .ToList();

            return users;
        }
        public async Task<User> GetOne(Guid userId)
        {
            var userEntity = await _db.Users.FindAsync(userId) ?? throw new Exception("Пользователь не найден");

            var user = User.Create(
                userEntity.UserId,
                userEntity.Name,
                userEntity.SecondName,
                userEntity.PhoneNumber,
                userEntity.Email,
                userEntity.TfAuth,
                userEntity.Role,
                userEntity.PassportNumber,
                userEntity.BirthdayDate,
                userEntity.PassportId,
                userEntity.Password
                );

            return user;
        }
        public async Task<User> Add(User user)
        {
            var userEntity = new UserEntity
            {
                UserId = user.Id,
                Name = user.Name,
                SecondName = user.SecondName,
                PhoneNumber = user.PhoneNumber,
                Email = user.Email,
                TfAuth = user.TfAuth,
                Role = user.Role,
                PassportNumber = user.PassportNumber,
                BirthdayDate = user.BirthdayDate,
                PassportId = user.PassportId,
                Password = user.Password,
                RefreshToken = user.RefreshToken
            };

            await _db.Users.AddAsync(userEntity);
            await _db.SaveChangesAsync();

            return user;
        }
        public async Task<Guid> Update(Guid id, string name, string secondname, string phoneNumber, string email, bool tfAuth, string passportNumber, string birthdayDate, string passportId)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == id) ?? throw new Exception();
            
            await _db.Users
                .Where(u => u.UserId == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.Name, u => name)
                    .SetProperty(u => u.SecondName, u => secondname)
                    .SetProperty(u => u.PhoneNumber, u => phoneNumber)
                    .SetProperty(u => u.Email, u => email)
                    .SetProperty(u => u.TfAuth, u => tfAuth)
                    .SetProperty(u => u.PassportNumber, u => passportNumber)
                    .SetProperty(u => u.BirthdayDate, u => birthdayDate)
                    .SetProperty(u => u.PassportId, u => passportId)
                    );

            return id;
        }
        public async Task<Guid> Delete(Guid id)
        {
            await _db.Users
                .Where(u => u.UserId == id)
                .ExecuteDeleteAsync();

            return id;
        }
        public async Task<User> GetByPhoneNumber(string phoneNumber)
        {
            var userEntities = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber) ?? throw new Exception("Нет пользователя с таким номером телефона");

            var user = User.Create(
                userEntities.UserId,
                userEntities.Name,
                userEntities.SecondName,
                userEntities.PhoneNumber,
                userEntities.Email,
                userEntities.TfAuth,
                userEntities.Role,
                userEntities.PassportNumber,
                userEntities.BirthdayDate,
                userEntities.PassportId,
                userEntities.Password);

            return user;
        }
        public async Task<bool> CheckIsExist(string phoneNumber)
        {
            var userEntity = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);

            return userEntity != null;
        }
        public async Task<User> GetById(Guid id)
        {
            var userEntities = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.UserId == id) ?? throw new Exception("Нет пользователя с таким Id");

            var user = User.Create(
                userEntities.UserId,
                userEntities.Name,
                userEntities.SecondName,
                userEntities.PhoneNumber,
                userEntities.Email,
                userEntities.TfAuth,
                userEntities.Role,
                userEntities.PassportNumber,
                userEntities.BirthdayDate,
                userEntities.PassportId,
                userEntities.Password);

            return user;
        }
        public async Task<Guid> UpdateToken(Guid id, string token)
        {
            await _db.Users
                .Where(u => u.UserId == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.RefreshToken, u => token)
                    );

            return id;
        }
        public async Task<Guid> DeleteToken(Guid id)
        {
            await _db.Users
                .Where(u => u.UserId == id)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(u => u.RefreshToken, u => ""));

            return id;
        }
        public async Task<User?> FindToken(string token)
        {
            var userEntities = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.RefreshToken == token);

            if(userEntities == null)
            {
                return null;
            }
            else
            {
                var user = User.Create(
                userEntities.UserId,
                userEntities.Name,
                userEntities.SecondName,
                userEntities.PhoneNumber,
                userEntities.Email,
                userEntities.TfAuth,
                userEntities.Role,
                userEntities.PassportNumber,
                userEntities.BirthdayDate,
                userEntities.PassportId,
                userEntities.Password);

                return user;
            }
        }
    }
}
