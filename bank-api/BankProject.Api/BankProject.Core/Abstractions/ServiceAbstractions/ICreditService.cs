using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface ICreditService
    {
        public Task<(Credit, string)> TryAdd(Guid billId, Guid userId, string dateStart, int monthToPay, decimal amountOfMoney, int procents, decimal salary);
        public Task<(Guid, string)> ChangeCreditStatus(Guid userId, Guid messageId, Guid creditId, bool status);
        public Task<(List<Credit>, string)> GetAllCredits();
        public Task<(List<Credit>, string)> GetAllCreditsByBill(Guid billId);
        public Task<(Credit, string)> GetOneCreditById(Guid creditId);
        public Task<(Guid, string)> DeleteCredit(Guid creditId);
        public Task<(Guid, string)> UpdateCreditPayment(Guid billId, Guid creditId, decimal amountOfMoney, string cardNumber, string type);
        public Task<(Guid, string)> UpdateApplicationInf(Guid creditId, string dateStart, int monthToPay, decimal amountOfMoney, int procents);
        public Task<(Credit, string)> GetOneCredit(Guid creditId);
        public Task<(Guid, string)> UpdateCreditDebt(Guid creditId);
    }
}
