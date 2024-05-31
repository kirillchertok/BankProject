using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class BillsRepository : IBills
    {
        private readonly BankProjectDbContext _db;
        public BillsRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> Add(Guid bankAccountId, Bill bill)
        {
            var bankAccount = await _db.BankAccounts.Include(b => b.Bills).FirstAsync(b => b.BankAccountId == bankAccountId) ?? throw new Exception("Банковский аккаунт не найден");

            var billEntity = new BillEntity
            {
                BillId = bill.BillId,
                BillNumber = bill.BillNumber,
                Currency = bill.Currency,
                AmountOfMoney = bill.AmountOfMoney,
                AmountOfMoneyUnAllocated = bill.AmountOfMoneyUnAllocated,
                BankAccountId = bankAccountId,
            };

            await _db.Bills.AddAsync(billEntity);

            await _db.SaveChangesAsync();

            return billEntity.BillId;
        }
        public async Task<List<Bill>> Get()
        {
            var billEntities = await _db.Bills
                .AsNoTracking()
                .ToListAsync();

            var bills = billEntities
                .Select(b => Bill.Create(b.BillId, b.BillNumber, b.Currency, b.AmountOfMoney, b.AmountOfMoneyUnAllocated, b.BankAccountId))
                .ToList();

            return bills;
        }
        public async Task<List<Bill>> GetAllByAccount(Guid bankAccountId)
        {
            var bankAccount = await _db.BankAccounts.Include(b => b.Bills).FirstAsync(b => b.BankAccountId == bankAccountId) ?? throw new Exception("Банковский аккаунт не найден");

            var bills = bankAccount.Bills
                .Select(b => Bill.Create(b.BillId, b.BillNumber, b.Currency, b.AmountOfMoney, b.AmountOfMoneyUnAllocated, b.BankAccountId))
                .ToList();

            return bills;
        }
        public async Task<Bill> GetOneById(Guid billId)
        {
            var billEntity = await _db.Bills.FindAsync(billId) ?? throw new Exception("Счет не найден");

            var bill = Bill.Create(billEntity.BillId, billEntity.BillNumber, billEntity.Currency, billEntity.AmountOfMoney, billEntity.AmountOfMoneyUnAllocated, billEntity.BankAccountId);

            return bill;
        }
        public async Task<Guid> AddCreditMoney(Guid billId, decimal amountOfMoney)
        {
            var bill = await _db.Bills.FindAsync(billId) ?? throw new Exception("Счет не найден");

            bill.AmountOfMoneyUnAllocated += amountOfMoney;

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> AddUnAllocatedMoney(Guid billId, decimal amountOfMoney, string cardNumber)
        {
            var bill = await _db.Bills.FindAsync(billId) ?? throw new Exception("Счет не найден");

            var card = await _db.Cards.FirstAsync(c => c.CardNumber == cardNumber) ?? throw new Exception("Карта не найдена");

            bill.AmountOfMoney += amountOfMoney;
            bill.AmountOfMoneyUnAllocated -= amountOfMoney;

            card.AmountOfMoney += amountOfMoney;

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> SendMoneyCardCard(Guid billId ,Guid cardSId, Guid cardRId, decimal amountOfMoney)
        {
            var bill = await _db.Bills.FindAsync(billId) ?? throw new Exception("Счет не найден");

            var cardS = bill.Cards.First(c => c.CardId == cardSId) ?? throw new Exception("Неверный номер карты-отправителя");

            var cardR = bill.Cards.First(c => c.CardId == cardRId) ?? throw new Exception("Неверный номер карты-получателя");

            cardS.AmountOfMoney -= amountOfMoney;
            cardR.AmountOfMoney += amountOfMoney;

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> AddMoney(Guid billId, decimal amountOfMoney)
        {
            var bill = await _db.Bills
                .Include(c => c.Cards)
                .FirstOrDefaultAsync(b => b.BillId == billId)
                ?? throw new Exception("Счет не найден");

            bill.AmountOfMoney += amountOfMoney;
            if(bill.Cards.Count > 0)
            {
                bill.Cards[0].AmountOfMoney += amountOfMoney;
            }

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> AddMoneyUnAllocated(Guid billId, decimal amountOfMoney)
        {
            var bill = await _db.Bills
                .FirstOrDefaultAsync(b => b.BillId == billId)
                ?? throw new Exception("Счет не найден");

            bill.AmountOfMoneyUnAllocated += amountOfMoney;

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> RemoveMoney(Guid billId, decimal amountOfMoney)
        {
            var bill = await _db.Bills
                .Include(bill => bill.Cards)
                .FirstOrDefaultAsync(b => b.BillId == billId)
                ?? throw new Exception("Счет не найден");

            bill.AmountOfMoney -= amountOfMoney;
            if(bill.Cards.Count > 0)
            {
                bill.Cards[0].AmountOfMoney -= amountOfMoney;
            }

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
        public async Task<Guid> RemoveMoneyUnAllocated(Guid billId, decimal amountOfMoney)
        {
            var bill = await _db.Bills
                .FirstOrDefaultAsync(b => b.BillId == billId)
                ?? throw new Exception("Счет не найден");

            bill.AmountOfMoneyUnAllocated -= amountOfMoney;

            await _db.SaveChangesAsync();

            return bill.BillId;
        }
    }
}
