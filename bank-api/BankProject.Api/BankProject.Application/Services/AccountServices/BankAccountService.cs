using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;

namespace BankProject.Application.Services.AccountServices
{
    public class BankAccountService : IBankAccountService
    {
        private readonly IBankAccount _bankAccount;
        public BankAccountService(IBankAccount bankAccount)
        {
            _bankAccount = bankAccount;
        }
        public async Task<(Guid,string)> CreateAccount(Guid userId, bool isBanned = false)
        {
            try
            {
                var bankAccount = BankAccount.Create(Guid.NewGuid(), isBanned, userId);

                var id = await _bankAccount.Add(userId, bankAccount);

                return (id,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(List<BankAccount>, string)> GetAllAccounts()
        {
            try
            {
                var bankAccounts = await _bankAccount.Get();

                return (bankAccounts,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<BankAccount>(), ex.Message);
            }
        }
        public async Task<(BankAccount, string)> GetAccountByUserId(Guid userId)
        {
            try
            {
                var bankAccount = await _bankAccount.GetByUser(userId);

                return (bankAccount,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new BankAccount(), ex.Message);
            }
        }
        public async Task<(Guid, string)> BanAccountByAccountId(Guid bankAccountId)
        {
            try
            {
                var id = await _bankAccount.BanByAccount(bankAccountId);

                return (id,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> BanAccountByUserId(Guid userId)
        {
            try
            {
                var id = await _bankAccount.BanByUser(userId);

                return (id,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> UnBanAccountByAccountId(Guid bankAccountId)
        {
            try
            {
                var id = await _bankAccount.UnBanByAccount(bankAccountId);

                return (id,"OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> UnBanAccountByUserId(Guid bankAccountId)
        {
            try
            {
                var id = await _bankAccount.UnBanByUser(bankAccountId);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(bool ,string)> CheckBan(Guid userId)
        {
            try
            {
                var (account, error) = await this.GetAccountByUserId(userId);

                if(error != "OK")
                {
                    throw new Exception(error);
                }

                return (account.IsBanned, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (false, ex.Message);
            }
        }
        public async Task<(Guid, string)> DeleteAccount(Guid bankAccountId)
        {
            try
            {
                var id = await _bankAccount.Delete(bankAccountId);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
    }
}
