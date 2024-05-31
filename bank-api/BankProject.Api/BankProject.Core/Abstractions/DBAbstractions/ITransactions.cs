using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface ITransactions
    {
        public Task<Guid> AddBillBill(Guid bankAccountId, TransactionAdmin transaction);
        public Task<Guid> AddBillCard(Guid bankAccountId, TransactionAdmin transaction);
        public Task<Guid> AddCardBill(Guid bankAccountId, TransactionAdmin transaction);
        public Task<Guid> AddCardCard(Guid bankAccountId, TransactionAdmin transaction);
        public Task<List<TransactionAdmin>> Get();
        public Task<List<TransactionAdmin>> GetAllByBillAdmin(Guid billId);
        public Task<TransactionAdmin> GetOneById(Guid transactionId);
        public Task<List<TransactionUser>> GetAllByBillUser(Guid billId);
        public Task<List<TransactionUser>> GetLastFiveByBillUser(Guid billId);
    }
}
