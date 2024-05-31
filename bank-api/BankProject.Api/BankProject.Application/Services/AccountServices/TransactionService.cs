using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace BankProject.Application.Services.AccountServices
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactions _transactions;
        public TransactionService(ITransactions transactions)
        {
            _transactions = transactions;
        }
        public async Task<(Guid, string)> AddTransactionBillBill(
            Guid bankAccountId,
            string date, 
            Guid senderBillId, 
            string senderBillNumber, 
            Guid receiverBillId, 
            string receiverBillNumber,
            decimal amountOfMoney, 
            Guid billid,
            string receiverCard,
            string senderCard)
        {
            try
            {
                var transaction = TransactionAdmin.Create(Guid.NewGuid(), Guid.NewGuid(), date, senderBillId, senderBillNumber, senderCard, receiverBillId, receiverBillNumber, receiverCard, amountOfMoney, billid);

                var id = await _transactions.AddBillBill(bankAccountId, transaction);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddTransactionBillCard(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard)
        {
            try
            {
                var transaction = TransactionAdmin.Create(Guid.NewGuid(), Guid.NewGuid(), date,senderBillId, senderBillNumber, senderCard, receiverBillId, receiverBillNumber, receiverCard, amountOfMoney, billid);

                var id = await _transactions.AddBillCard(bankAccountId, transaction);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddTransactionCardBill(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard)
        {
            try
            {
                var transaction = TransactionAdmin.Create(Guid.NewGuid(), Guid.NewGuid(), date,  senderBillId, senderBillNumber, senderCard, receiverBillId, receiverBillNumber, receiverCard, amountOfMoney, billid);

                var id = await _transactions.AddCardBill(bankAccountId, transaction);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddTransactionCardCard(
            Guid bankAccountId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            Guid receiverBillId,
            string receiverBillNumber,
            decimal amountOfMoney,
            Guid billid,
            string receiverCard,
            string senderCard)
        {
            try
            {
                var transaction = TransactionAdmin.Create(Guid.NewGuid(), Guid.NewGuid(), date, senderBillId, senderBillNumber, senderCard, receiverBillId, receiverBillNumber, receiverCard, amountOfMoney, billid);

                var id = await _transactions.AddCardCard(bankAccountId, transaction);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(List<TransactionAdmin>, string)> GetAllTransactions()
        {
            try
            {
                var transactions = await _transactions.Get();

                return (transactions, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<TransactionAdmin>(), ex.Message);
            }
        }
        public async Task<(List<TransactionAdmin>, string)> GetAllTransactionsByBillAdmin(Guid billId)
        {
            try
            {
                var transactions = await _transactions.GetAllByBillAdmin(billId);

                return (transactions, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<TransactionAdmin>(), ex.Message);
            }
        }
        public async Task<(TransactionAdmin, string)> GetOneTransactiondByid(Guid transactionId)
        {
            try
            {
                var transaction = await _transactions.GetOneById(transactionId);

                return (transaction, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new TransactionAdmin(), ex.Message);
            }
        }
        public async Task<(List<TransactionUser>, string)> GetAllTransactionsByBillUser(Guid billId)
        {
            try
            {
                var transactions = await _transactions.GetAllByBillUser(billId);

                return (transactions, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<TransactionUser>(), ex.Message);
            }
        }
        public async Task<(List<TransactionUser>, string)> GetLastFiveByBillUser(Guid billId)
        {
            try
            {
                var transactions = await _transactions.GetLastFiveByBillUser(billId);

                return (transactions, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<TransactionUser>(), ex.Message);
            }
        }
        public async Task<(decimal, decimal, decimal, decimal, string)> GetBillLastMonthTrsProcents(Guid billId)
        {
            try
            {
                var transactions = await _transactions.GetAllByBillAdmin(billId);

                DateTime date = DateTime.Now;

                string format = "ddd MMM dd yyyy HH:mm:ss 'GMT'K";

                List<TransactionAdmin> lastMonthTrs = [];

                foreach (var transaction in transactions)
                {
                    string dateString = transaction.Date;

                    int index = dateString.IndexOf(" (");
                    if (index > 0)
                    {
                        dateString = dateString.Substring(0, index);
                    }

                    if (DateTime.ParseExact(dateString, format, CultureInfo.InvariantCulture, DateTimeStyles.None).Month == date.Month && transaction.SenderBillNumber != transaction.ReceiverBillNumber)
                    {
                        lastMonthTrs.Add(transaction);
                    }
                }

                if(lastMonthTrs.Count == 0)
                {
                    return (0, 0, 0, 0, "OK");
                }

                decimal sendedMoney = 0;
                decimal receivedMoney = 0;

                foreach (var trs in lastMonthTrs)
                {
                    if (trs.SenderBillId == billId)
                    {
                        sendedMoney += trs.AmountOfMoney;
                    }
                    else if (trs.ReceiverBillId == billId)
                    {
                        receivedMoney += trs.AmountOfMoney;
                    }
                }

                decimal allMoney = sendedMoney + receivedMoney;
                decimal sendedMoneyProcent = Math.Ceiling((sendedMoney * 100) / allMoney);
                decimal receivedmoneyProcent = 100 - sendedMoneyProcent;

                return (sendedMoneyProcent, sendedMoney, receivedmoneyProcent, receivedMoney, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (0, 0, 0, 0, ex.Message);
            }
        }
    }
}
