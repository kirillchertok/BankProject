using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface IBankAccount
    {
        public Task<Guid> Add(Guid userId, BankAccount bankAccount);
        public Task<List<BankAccount>> Get();
        public Task<BankAccount> GetByUser(Guid userId);
        public Task<Guid> BanByAccount(Guid bankAccountId);
        public Task<Guid> BanByUser(Guid userId);
        public Task<Guid> UnBanByAccount(Guid bankAccountId);
        public Task<Guid> UnBanByUser(Guid userId);
        public Task<Guid> Delete(Guid bankAccountId);
    }
}
