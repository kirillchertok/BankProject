using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface IBankAccountService
    {
        public Task<(Guid, string)> CreateAccount(Guid userId, bool isBanned = false);
        public Task<(List<BankAccount>, string)> GetAllAccounts();
        public Task<(BankAccount, string)> GetAccountByUserId(Guid userId);
        public Task<(Guid, string)> BanAccountByAccountId(Guid bankAccountId);
        public Task<(Guid, string)> BanAccountByUserId(Guid userId);
        public Task<(Guid, string)> UnBanAccountByAccountId(Guid bankAccountId);
        public Task<(Guid, string)> UnBanAccountByUserId(Guid bankAccountId);
        public Task<(bool, string)> CheckBan(Guid userId);
        public Task<(Guid, string)> DeleteAccount(Guid bankAccountId);
    }
}
