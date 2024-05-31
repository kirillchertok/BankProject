using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface IBillService
    {
        public Task<(Guid, string)> AddBill(Guid bankAccountId, string currency, string role, string puspose);
        public Task<(List<Bill>, string)> GetAllBills();
        public Task<(List<Bill>, string)> GetAllAccountBills(Guid bankAccountId);
        public Task<(Bill, string)> GetBillById(Guid billId);
        public Task<(Guid, string)> AddCreditMoney(Guid billId, decimal amountOfMoney);
        public Task<(Guid, string)> AddUnAllocatedMoney(Guid billId, decimal amounntOfMoney, string cardNumber);
        public Task<(Guid, string)> SendMoneyCardCard(Guid billId, Guid cardSId, Guid cardRId, decimal amountOfMoney);
        public Task<(Guid, string)> AddMoneyToBill(Guid billId, decimal amountOfMoney);
        public Task<(Guid, string)> AddMoneyToBillUnAllocated(Guid billId, decimal amountOfMoney);
        public Task<(Guid, string)> RemoveMoneyFromBill(Guid billId, decimal amountOfMoney);
        public Task<(Guid, string)> RemoveMoneyFromBillUnAllocated(Guid billId, decimal amountOfMoney);
    }
}
