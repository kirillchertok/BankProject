using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class BankAccountRepository : IBankAccount
    {
        private readonly BankProjectDbContext _db;
        public BankAccountRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> Add(Guid userId, BankAccount bankAccount)
        {
            var user = await _db.Users.FindAsync(userId) ?? throw new Exception("Пользователь не найден");

            var bankAccountEntity = new BankAccountEntity
            {
                BankAccountId = bankAccount.BankAccountId,
                IsBanned = bankAccount.IsBanned,
                UserId = userId,
                User = user,
            };

            await _db.BankAccounts.AddAsync(bankAccountEntity);

            user.BankAccountId = bankAccountEntity.BankAccountId;

            await _db.SaveChangesAsync();

            return bankAccountEntity.BankAccountId;
        }
        public async Task<List<BankAccount>> Get()
        {
            var bankAccountEntities = await _db.BankAccounts
                .AsNoTracking()
                .ToListAsync();

            var bankAccounts = bankAccountEntities
                .Select(b => BankAccount.Create(b.BankAccountId, b.IsBanned, b.UserId))
                .ToList();

            return bankAccounts;
        }
        public async Task<BankAccount> GetByUser(Guid userId)
        {
            var user = await _db.Users.Include(u => u.BankAccount).FirstAsync(u => u.UserId == userId) ?? throw new Exception("Пользователь не найден");

            var bankAccountEntity = user.BankAccount;

            if(bankAccountEntity == null)
            {
                throw new Exception("У пользователя нет аккаунта");
            }
            //if(bankAccountEntity.IsBanned == true)
            //{
            //    throw new Exception("Пользователь заблокирован");
            //}

            var bankAccount = BankAccount.Create(bankAccountEntity.BankAccountId, bankAccountEntity.IsBanned, bankAccountEntity.UserId);

            return bankAccount;
        }
        public async Task<Guid> BanByAccount(Guid bankAccountId)
        {
            var bankAccount = await _db.BankAccounts.FindAsync(bankAccountId) ?? throw new Exception("Банковский аккаунт не найден");

            bankAccount.IsBanned = true;
            await _db.SaveChangesAsync();

            return bankAccount.BankAccountId;
        }
        public async Task<Guid> BanByUser(Guid userId)
        {
            var user = await _db.Users.Include(u => u.BankAccount).FirstOrDefaultAsync(u => u.UserId == userId) ?? throw new Exception("Пользователь не найден");

            var bankAccount = user.BankAccount;

            if (bankAccount == null)
            {
                throw new Exception("У пользователя нет аккаунта");
            }

            bankAccount.IsBanned = true;
            await _db.SaveChangesAsync();

            return bankAccount.BankAccountId;
        }
        public async Task<Guid> UnBanByAccount(Guid bankAccountId)
        {
            var bankAccount = await _db.BankAccounts.FindAsync(bankAccountId) ?? throw new Exception("Банковский аккаунт не найден");

            bankAccount.IsBanned = false;
            await _db.SaveChangesAsync();

            return bankAccount.BankAccountId;
        }
        public async Task<Guid> UnBanByUser(Guid userId)
        {
            var user = await _db.Users.Include(u => u.BankAccount).FirstOrDefaultAsync(u => u.UserId == userId) ?? throw new Exception("Пользователь не найден");

            var bankAccount = user.BankAccount;

            if (bankAccount == null)
            {
                throw new Exception("У пользователя нет аккаунта");
            }

            bankAccount.IsBanned = false;
            await _db.SaveChangesAsync();

            return bankAccount.BankAccountId;
        }
        public async Task<Guid> Delete(Guid bankAccountId)
        {
            await _db.BankAccounts
                .Where(b => b.BankAccountId == bankAccountId)
                .ExecuteDeleteAsync();

            return bankAccountId;
        }
    }
}
