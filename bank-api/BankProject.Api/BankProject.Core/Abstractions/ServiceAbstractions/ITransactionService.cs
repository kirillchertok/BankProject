using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface ITransactionService
    {
        public Task<(Guid, string)> AddTransactionBillBill(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard);
        public Task<(Guid, string)> AddTransactionBillCard(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard);
        public Task<(Guid, string)> AddTransactionCardBill(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard);
        public Task<(Guid, string)> AddTransactionCardCard(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard);
        public Task<(List<TransactionAdmin>, string)> GetAllTransactions();
        public Task<(List<TransactionAdmin>, string)> GetAllTransactionsByBillAdmin(Guid billId);
        public Task<(TransactionAdmin, string)> GetOneTransactiondByid(Guid transactionId);
        public Task<(List<TransactionUser>, string)> GetAllTransactionsByBillUser(Guid billId);
        public Task<(List<TransactionUser>, string)> GetLastFiveByBillUser(Guid billId);
        public Task<(decimal, decimal, decimal, decimal, string)> GetBillLastMonthTrsProcents(Guid billId);
    }
}
