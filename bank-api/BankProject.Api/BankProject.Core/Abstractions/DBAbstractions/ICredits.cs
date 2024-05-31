using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface ICredits
    {
        public Task<Guid> Add(Guid billId, Credit credit);
        public Task<Guid> UpdateStatus(Guid creditId, bool status);
        public Task<List<Credit>> Get();
        public Task<List<Credit>> GetAllByBill(Guid billId);
        public Task<Credit> GetOneById(Guid creditId);
        public Task<Guid> Delete(Guid creditId);
        public Task<Guid> UpdatePayment(Guid billid, Guid creditId, decimal amountOfMoney, string cardNumber, string type);
        public Task<Guid> UpdateAllInf(Guid creditId, string dateStart, int monthToPay, decimal amountOfMoney, int procents);
        public Task<Guid> UpdateDebt(Guid creditId, Credit updatedCredit);
    }
}
