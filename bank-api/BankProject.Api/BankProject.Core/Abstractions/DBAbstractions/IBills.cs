using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface IBills
    {
        public Task<Guid> Add(Guid bankAccountId, Bill bill);
        public Task<List<Bill>> Get();
        public Task<List<Bill>> GetAllByAccount(Guid bankAccountId);
        public Task<Bill> GetOneById(Guid billId);
        public Task<Guid> AddCreditMoney(Guid billId, decimal amountOfMoney);
        public Task<Guid> AddUnAllocatedMoney(Guid billId, decimal amountOfMoney, string cardNumber);
        public Task<Guid> SendMoneyCardCard(Guid billId, Guid cardSId, Guid cardRId, decimal amountOfMoney);
        public Task<Guid> AddMoney(Guid billId, decimal amountOfMoney);
        public Task<Guid> AddMoneyUnAllocated(Guid billId, decimal amountOfMoney);
        public Task<Guid> RemoveMoney(Guid billId, decimal amountOfMoney);
        public Task<Guid> RemoveMoneyUnAllocated(Guid billId, decimal amountOfMoney);
    }
}
