using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Json;
using Newtonsoft.Json.Linq;

namespace BankProject.DataAccess.Repositories
{
    public class TransactionsRepository : ITransactions
    {
        public class Rate
        {
            private Rate(int sellRate, string sellIso, int sellCode, int buyRate, string buyIso, int buyCode, int quantity, string? name, string date)
            {
                SellRate = sellRate;
                SellIso = sellIso;
                SellCode = sellCode;
                BuyRate = buyRate;
                BuyIso = buyIso;
                BuyCode = buyCode;
                Quantity = quantity;
                Name = name;
                Date = date;
            }
            public int SellRate { get; set; }
            public string SellIso { get; set; } = string.Empty;
            public int SellCode { get; set; }
            public int BuyRate { get; set; }
            public string BuyIso { get; set; } = string.Empty;
            public int BuyCode { get; set; }
            public int Quantity { get; set; }
            public string? Name { get; set; }
            public string Date { get; set; } = string.Empty;
            public static Rate Create(int sellRate, string sellIso, int sellCode, int buyRate, string buyIso, int buyCode, int quantity, string? name, string date)
            {
                var rate = new Rate(sellRate, sellIso, sellCode, buyRate, buyIso, buyCode, quantity, name, date);

                return rate;
            }
        }
        public async Task<List<Rate>> GetRates()
        {
            using (HttpClient client = new HttpClient())
            {
                List<Rate> rates = new List<Rate>();
                try
                {
                    string url = "https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates";

                    HttpResponseMessage response = await client.GetAsync(url);

                    response.EnsureSuccessStatusCode();

                    string responseBody = await response.Content.ReadAsStringAsync();

                    JObject json = JObject.Parse(responseBody);

                    JArray ratesArray = (JArray)json["rates"];

                    foreach (var rate in ratesArray)
                    {
                        int sellRate = (int)rate["sellRate"];
                        string sellIso = (string)rate["sellIso"];
                        int sellCode = (int)rate["sellCode"];
                        int buyRate = (int)rate["buyRate"];
                        string buyIso = (string)rate["buyIso"];
                        int buyCode = (int)rate["buyCode"];
                        int quantity = (int)rate["quantity"];
                        string name = (string)rate["name"];
                        string date = (string)rate["date"];

                        rates.Add(Rate.Create(sellRate, sellIso, sellCode, buyRate, buyIso, buyCode, quantity, name, date));

                        Console.WriteLine($"Sell Rate: {sellRate}, Sell Iso: {sellIso}, Sell Code: {sellCode}");
                        Console.WriteLine($"Buy Rate: {buyRate}, Buy Iso: {buyIso}, Buy Code: {buyCode}");
                        Console.WriteLine($"Quantity: {quantity}, Name: {name}, Date: {date}");
                        Console.WriteLine();
                    }

                    return rates;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    return rates;
                }
            }
        }
        public async Task<decimal> CalculateAmountOfMoney(BillEntity billSender, BillEntity billReceiver, decimal amountOfMoneyReceiver)
        {
            var rates = (await GetRates()).ToArray();

            if (rates == null)
            {
                throw new Exception("Непредвиденная ошибка");
            }

            var rate = rates.FirstOrDefault(b => b.SellIso == billSender.Currency && b.BuyIso == billReceiver.Currency);

            if (rate == null)
            {
                rate = rates.FirstOrDefault(b => b.SellIso == billReceiver.Currency && b.BuyIso == billSender.Currency);

                if (rate == null)
                {
                    throw new Exception("Непредвиденная ошибка");
                }

                amountOfMoneyReceiver /= (rate.SellRate / rate.Quantity);
            }
            else
            {
                amountOfMoneyReceiver *= (rate.SellRate / rate.Quantity);
            }

            return (Math.Round(amountOfMoneyReceiver, 2));
        }
        
        private readonly BankProjectDbContext _db;
        public TransactionsRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> AddBillBill(Guid bankAccountId, TransactionAdmin transaction)
        {
            if(string.IsNullOrEmpty(transaction.SenderBillNumber))
            {
                throw new Exception("Не указан номер счета отправителя");
            }
            if (string.IsNullOrEmpty(transaction.ReceiverBillNumber))
            {
                throw new Exception("Не указан номер счета получателя");
            }

            var billSender = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillNumber == transaction.SenderBillNumber) 
                ?? throw new Exception("Неверно указан номер счета отправителся");

            if(billSender.BankAccountId != bankAccountId)
            {
                throw new Exception("Неверно указан номер счета отправителся");
            }

            if (billSender.AmountOfMoney + billSender.AmountOfMoneyUnAllocated < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            var billReceiver = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillNumber == transaction.ReceiverBillNumber) 
                ?? throw new Exception("Неверно указан номер счета получателя");

            var amountOfMoneySender = transaction.AmountOfMoney;
            var amountOfMoneyReceiver = transaction.AmountOfMoney;

            if (billReceiver.Currency != billSender.Currency)
            {
                amountOfMoneyReceiver = await CalculateAmountOfMoney(billSender, billReceiver, amountOfMoneyReceiver);
            }

            transaction.ReceiverBillId = billReceiver.BillId;
            transaction.SenderBillId = billSender.BillId;

            var tmpTransactionMoney = amountOfMoneySender;

            if (billSender.AmountOfMoneyUnAllocated >= tmpTransactionMoney)
            {
                billSender.AmountOfMoneyUnAllocated -= tmpTransactionMoney;
                tmpTransactionMoney = 0;
            }
            else
            {
                if (billSender.AmountOfMoneyUnAllocated > 0)
                {
                    tmpTransactionMoney -= billSender.AmountOfMoneyUnAllocated;
                    billSender.AmountOfMoneyUnAllocated = 0;
                }
                billSender.AmountOfMoney -= tmpTransactionMoney;
                if (billSender.Cards.Count != 0)
                {
                    var card = billSender.Cards.FirstOrDefault(c => c.AmountOfMoney > tmpTransactionMoney);
                    //billSender.Cards.First(c => c.CardId == card.CardId).AmountOfMoney -= transaction.AmountOfMoney;
                    //transaction.SenderCard = billSender.Cards.First().CardNumber;
                    if (card != null)
                    {
                        card.AmountOfMoney -= tmpTransactionMoney;
                        transaction.SenderCard = card.CardNumber;
                    }
                    else
                    {
                        var tmpMoney = tmpTransactionMoney;
                        var index = 0;
                        while (tmpMoney > 0)
                        {
                            if (billSender.Cards[index].AmountOfMoney >= tmpMoney)
                            {
                                billSender.Cards[index].AmountOfMoney -= tmpMoney;
                                tmpMoney = 0;
                                transaction.SenderCard = billSender.Cards[index].CardNumber;
                            }
                            else
                            {
                                tmpMoney -= billSender.Cards[index].AmountOfMoney;
                                billSender.Cards[index].AmountOfMoney = 0;
                            }
                            index++;
                        }
                    }
                }
            }

            billReceiver.AmountOfMoneyUnAllocated += amountOfMoneyReceiver;

            var transactionSenderEntity = new TransactionEntity
            {
                TransactionId = Guid.NewGuid(),
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = transaction.AmountOfMoney,
                BillId = transaction.SenderBillId
            };
            var transactionReseiverEntity = new TransactionEntity
            {
                TransactionId = Guid.NewGuid(),
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = amountOfMoneyReceiver,
                BillId = transaction.ReceiverBillId
            };

            await _db.Transactions.AddRangeAsync(transactionSenderEntity, transactionReseiverEntity);

            await _db.SaveChangesAsync();

            return transactionSenderEntity.TransactionIdAdmin;
        }
        public async Task<Guid> AddBillCard(Guid bankAccountId, TransactionAdmin transaction)
        {
            if (string.IsNullOrEmpty(transaction.ReceiverCard))
            {
                throw new Exception("Не указан номер карты получателя");
            }
            if (string.IsNullOrEmpty(transaction.SenderBillNumber))
            {
                throw new Exception("Не указан номер счета отправителя");
            }

            var billSender = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillNumber == transaction.SenderBillNumber)
                ?? throw new Exception("Счет отправителя не найден");

            if (billSender.BankAccountId != bankAccountId)
            {
                throw new Exception("Неверно указан номер счета отправителся");
            }
            if (billSender.AmountOfMoney + billSender.AmountOfMoneyUnAllocated < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            var card = await _db.Cards
                .FirstOrDefaultAsync(c => c.CardNumber == transaction.ReceiverCard) 
                ?? throw new Exception("Неверный номер карты");

            var billReceiver = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillId == card.BillId)
                ?? throw new Exception("Неверный номер карты");

            var amountOfMoneySender = transaction.AmountOfMoney;
            var amountOfMoneyReceiver = transaction.AmountOfMoney;

            if (billReceiver.Currency != billSender.Currency)
            {
                amountOfMoneyReceiver = await CalculateAmountOfMoney(billSender, billReceiver, amountOfMoneyReceiver);
            }

            transaction.SenderBillId = billSender.BillId;
            transaction.ReceiverBillId = billReceiver.BillId;
            transaction.ReceiverBillNumber = billReceiver.BillNumber;

            var tmpTransactionMoney = amountOfMoneySender;

            if (billSender.AmountOfMoneyUnAllocated >= tmpTransactionMoney)
            {
                billSender.AmountOfMoneyUnAllocated -= tmpTransactionMoney;
                tmpTransactionMoney = 0;
            }
            else
            {
                if (billSender.AmountOfMoneyUnAllocated > 0)
                {
                    tmpTransactionMoney -= billSender.AmountOfMoneyUnAllocated;
                    billSender.AmountOfMoneyUnAllocated = 0;
                }
                billSender.AmountOfMoney -= tmpTransactionMoney;
                if (billSender.Cards.Count != 0)
                {
                    var card1 = billSender.Cards.FirstOrDefault(c => c.AmountOfMoney > tmpTransactionMoney);
                    //billSender.Cards.First(c => c.CardId == card.CardId).AmountOfMoney -= transaction.AmountOfMoney;
                    //transaction.SenderCard = billSender.Cards.First().CardNumber;
                    if (card1 != null)
                    {
                        card1.AmountOfMoney -= tmpTransactionMoney;
                        transaction.SenderCard = card1.CardNumber;
                    }
                    else
                    {
                        var tmpMoney = tmpTransactionMoney;
                        var index = 0;
                        while (tmpMoney > 0)
                        {
                            if (billSender.Cards[index].AmountOfMoney >= tmpMoney)
                            {
                                billSender.Cards[index].AmountOfMoney -= tmpMoney;
                                tmpMoney = 0;
                                transaction.SenderCard = billSender.Cards[index].CardNumber;
                            }
                            else
                            {
                                tmpMoney -= billSender.Cards[index].AmountOfMoney;
                                billSender.Cards[index].AmountOfMoney = 0;
                            }
                            index++;
                        }
                    }
                }
            }

            billReceiver.AmountOfMoney += amountOfMoneyReceiver;
            billReceiver.Cards.First(c => c.CardNumber == card.CardNumber).AmountOfMoney += amountOfMoneyReceiver;

            var transactionSenderEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = transaction.AmountOfMoney,
                BillId = transaction.SenderBillId
            };
            var transactionReseiverEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = amountOfMoneyReceiver,
                BillId = transaction.ReceiverBillId
            };

            await _db.Transactions.AddRangeAsync(transactionSenderEntity, transactionReseiverEntity);

            await _db.SaveChangesAsync();

            return transactionSenderEntity.TransactionIdAdmin;
        }
        public async Task<Guid> AddCardBill(Guid bankAccountId, TransactionAdmin transaction)
        {
            if (string.IsNullOrEmpty(transaction.SenderCard))
            {
                throw new Exception("Не указан номер карты");
            }
            if (string.IsNullOrEmpty(transaction.ReceiverBillNumber))
            {
                throw new Exception("Не указан номер счета отправителя");
            }

            var card = await _db.Cards
                .FirstOrDefaultAsync(c => c.CardNumber == transaction.SenderCard)
                ?? throw new Exception("Неверный номер карты");

            var billSender = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillId == card.BillId)
                ?? throw new Exception("Неверный номер карты");

            if (billSender.BankAccountId != bankAccountId)
            {
                throw new Exception("Неверно указан номер карты отправителся");
            }
            if (billSender.AmountOfMoney < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            var billReceiver = await _db.Bills
                .FirstOrDefaultAsync(b => b.BillNumber == transaction.ReceiverBillNumber)
                ?? throw new Exception("Счет отправителя не найден");

            var amountOfMoneySender = transaction.AmountOfMoney;
            var amountOfMoneyReceiver = transaction.AmountOfMoney;

            if (billReceiver.Currency != billSender.Currency)
            {
                amountOfMoneyReceiver = await CalculateAmountOfMoney(billSender, billReceiver, amountOfMoneyReceiver);
            }

            transaction.SenderBillId = billSender.BillId;
            transaction.SenderBillNumber = billSender.BillNumber;
            transaction.ReceiverBillId = billReceiver.BillId;

            if (billSender.Cards.First(c => c.CardNumber == card.CardNumber).AmountOfMoney < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }


            billSender.AmountOfMoney -= transaction.AmountOfMoney;
            billSender.Cards.First(c => c.CardNumber == card.CardNumber).AmountOfMoney -= transaction.AmountOfMoney;

            //billReceiver.AmountOfMoney += transaction.AmountOfMoney;
            //if (billSender.Cards.Count != 0)
            //{
            //    billSender.Cards.First().AmountOfMoney += transaction.AmountOfMoney;
            //    transaction.SenderCard = billSender.Cards.First().CardNumber;
            //}
            billReceiver.AmountOfMoneyUnAllocated += amountOfMoneyReceiver;

            var transactionSenderEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = transaction.AmountOfMoney,
                BillId = transaction.SenderBillId
            };
            var transactionReseiverEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = amountOfMoneyReceiver,
                BillId = transaction.ReceiverBillId
            };

            await _db.Transactions.AddRangeAsync(transactionSenderEntity, transactionReseiverEntity);

            await _db.SaveChangesAsync();

            return transactionSenderEntity.TransactionIdAdmin;
        }
        public async Task<Guid> AddCardCard(Guid bankAccountId, TransactionAdmin transaction)
        {
            if (string.IsNullOrEmpty(transaction.SenderCard))
            {
                throw new Exception("Не указан номер карты отправителся");
            }
            if (string.IsNullOrEmpty(transaction.ReceiverCard))
            {
                throw new Exception("Не указан номер карты получателся");
            }

            var cardS = await _db.Cards
               .FirstOrDefaultAsync(c => c.CardNumber == transaction.SenderCard)
               ?? throw new Exception("Неверный номер карты");

            var billSender = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillId == cardS.BillId)
                ?? throw new Exception("Неверный номер карты");

            if (billSender.BankAccountId != bankAccountId)
            {
                throw new Exception("Неверно указан номер карты отправителся");
            }
            if (billSender.AmountOfMoney < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            var cardR = await _db.Cards
                .FirstOrDefaultAsync(c => c.CardNumber == transaction.ReceiverCard)
                ?? throw new Exception("Неверный номер карты");

            var billReceiver = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillId == cardR.BillId)
                ?? throw new Exception("Неверный номер карты");

            var amountOfMoneySender = transaction.AmountOfMoney;
            var amountOfMoneyReceiver = transaction.AmountOfMoney;

            if (billReceiver.Currency != billSender.Currency)
            {
                amountOfMoneyReceiver = await CalculateAmountOfMoney(billSender, billReceiver, amountOfMoneyReceiver);
            }

            transaction.SenderBillId = billSender.BillId;
            transaction.SenderBillNumber = billSender.BillNumber;
            transaction.ReceiverBillId = billReceiver.BillId;
            transaction.ReceiverBillNumber = billReceiver.BillNumber;

            if (billSender.Cards.First(c => c.CardNumber == cardS.CardNumber).AmountOfMoney < transaction.AmountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            billSender.AmountOfMoney -= transaction.AmountOfMoney;
            billSender.Cards.First(c => c.CardNumber == cardS.CardNumber).AmountOfMoney -= transaction.AmountOfMoney;

            billReceiver.AmountOfMoney += amountOfMoneyReceiver;
            billReceiver.Cards.First(c => c.CardNumber == cardR.CardNumber).AmountOfMoney += amountOfMoneyReceiver;

            var transactionSenderEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = transaction.AmountOfMoney,
                BillId = transaction.SenderBillId
            };
            var transactionReseiverEntity = new TransactionEntity
            {
                TransactionId = Guid.Empty,
                TransactionIdAdmin = transaction.TransactionIdAdmin,
                Date = transaction.Date,
                SenderBillId = transaction.SenderBillId,
                SenderBillNumber = transaction.SenderBillNumber,
                SenderCard = transaction.SenderCard,
                ReceiverBillId = transaction.ReceiverBillId,
                ReceiverBillNumber = transaction.ReceiverBillNumber,
                ReceiverCard = transaction.ReceiverCard,
                AmountOfMoney = amountOfMoneyReceiver,
                BillId = transaction.ReceiverBillId
            };

            await _db.Transactions.AddRangeAsync(transactionSenderEntity, transactionReseiverEntity);

            await _db.SaveChangesAsync();

            return transactionSenderEntity.TransactionIdAdmin;
        }
        public async Task<List<TransactionAdmin>> Get()
        {
            var transactionEntitites = await _db.Transactions
                .AsNoTracking()
                .ToListAsync();

            var transactions = transactionEntitites
                .Select(t => TransactionAdmin.Create(
                    t.TransactionIdAdmin, 
                    t.TransactionId, 
                    t.Date, 
                    t.SenderBillId, 
                    t.SenderBillNumber, 
                    t.SenderCard, 
                    t.ReceiverBillId, 
                    t.ReceiverBillNumber, 
                    t.ReceiverCard , 
                    t.AmountOfMoney, 
                    t.BillId))
                .ToList();

            return transactions;
        }
        public async Task<List<TransactionAdmin>> GetAllByBillAdmin(Guid billId)
        {
            var bill = await _db.Bills
                .Include(b => b.Transactions)
                .FirstOrDefaultAsync(b => b.BillId == billId) ?? throw new Exception("Счет не найден");

            var transactions = bill.Transactions
                .Select(t => TransactionAdmin.Create(
                    t.TransactionIdAdmin,
                    t.TransactionId,
                    t.Date,
                    t.SenderBillId,
                    t.SenderBillNumber,
                    t.SenderCard,
                    t.ReceiverBillId,
                    t.ReceiverBillNumber,
                    t.ReceiverCard,
                    t.AmountOfMoney,
                    t.BillId))
                .ToList();

            return transactions;
        }
        public async Task<TransactionAdmin> GetOneById(Guid transactionId)
        {
            var transactionEntity = await _db.Transactions.FindAsync(transactionId) ?? throw new Exception("Перевод не найден");

            var transaction = TransactionAdmin.Create(
                    transactionEntity.TransactionIdAdmin,
                    transactionEntity.TransactionId,
                    transactionEntity.Date,
                    transactionEntity.SenderBillId,
                    transactionEntity.SenderBillNumber,
                    transactionEntity.SenderCard,
                    transactionEntity.ReceiverBillId,
                    transactionEntity.ReceiverBillNumber,
                    transactionEntity.ReceiverCard,
                    transactionEntity.AmountOfMoney,
                    transactionEntity.BillId);

            return transaction;
        }
        public async Task<List<TransactionUser>> GetAllByBillUser(Guid billId)
        {
            var bill = await _db.Bills
                .Include(b => b.Transactions)
                .FirstOrDefaultAsync(b => b.BillId == billId) ?? throw new Exception("Счет не найден");

            var transactions = bill.Transactions
                .Select(t => TransactionUser.Create(
                    t.Date,
                    t.SenderBillNumber,
                    t.SenderCard,
                    t.ReceiverBillNumber,
                    t.ReceiverCard,
                    t.AmountOfMoney))
                .ToList();

            return transactions;
        }
        public async Task<List<TransactionUser>> GetLastFiveByBillUser(Guid billId)
        {
            var bill = await _db.Bills.Include(t => t.Transactions).FirstOrDefaultAsync(b => b.BillId == billId) ?? throw new Exception("Счет не найден");

            var transactions = bill.Transactions.TakeLast(5)
                .Select(t => TransactionUser.Create(
                    t.Date,
                    t.SenderBillNumber,
                    t.SenderCard,
                    t.ReceiverBillNumber,
                    t.ReceiverCard,
                    t.AmountOfMoney))
                .ToList();

            return transactions;
        }
    }
}
