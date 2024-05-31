using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class CreditsRepository : ICredits
    {
        private readonly BankProjectDbContext _db;
        public CreditsRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> Add(Guid billId, Credit credit)
        {
            var bill = await _db.Bills
                .FirstOrDefaultAsync(b => b.BillId == billId) 
                ?? throw new Exception("Счет не найден");

            var creditEntity = new CreditEntity
            {
                CreditId = credit.CreditId,
                DateStart = credit.DateStart,
                MonthToPay = credit.MonthToPay,
                AmountOfMoney = credit.AmountOfMoney,
                Procents = credit.Procents,
                LeftToPay = credit.LeftToPay,
                LeftToPayThisMonth = credit.LeftToPayThisMonth,
                Endorsement = credit.Endorsement,
                BillId = billId,
            };

            await _db.Credits.AddAsync(creditEntity);

            await _db.SaveChangesAsync();

            return creditEntity.CreditId;
        }
        public async Task<Guid> UpdateStatus(Guid creditId, bool status)
        {
            var credit = await _db.Credits
                .FirstOrDefaultAsync(c => c.CreditId == creditId)
                ?? throw new Exception("Кредит не найден");

            credit.Endorsement = status;
            
            await _db.SaveChangesAsync();

            return credit.CreditId;
        }
        public async Task<Guid> UpdatePayment(Guid billid, Guid creditId, decimal amountOfMoney, string cardNumber, string type)
        {
            var credit = await _db.Credits
                .FirstOrDefaultAsync(c => c.CreditId == creditId)
                ?? throw new Exception("Кредит не найден");

            var bill = await _db.Bills
                .Include(c => c.Cards)
                .FirstOrDefaultAsync(c => c.BillId == billid)
                ?? throw new Exception("Счет не найден");

            if (bill.AmountOfMoney < amountOfMoney)
            {
                throw new Exception("Недостаточно средств");
            }

            if (type == "bill")
            {
                bill.AmountOfMoney -= amountOfMoney;
                var cardOne = bill.Cards.FirstOrDefault(c => c.AmountOfMoney >= amountOfMoney);
                if (cardOne != null)
                {
                    cardOne.AmountOfMoney -= amountOfMoney;
                }
                else
                {
                    var tmpMoney = amountOfMoney;
                    var index = 0;
                    while (tmpMoney > 0)
                    {
                        if(bill.Cards[index].AmountOfMoney >= tmpMoney)
                        {
                            bill.Cards[index].AmountOfMoney -= tmpMoney;
                            tmpMoney = 0;
                        }
                        else
                        {
                            tmpMoney -= bill.Cards[index].AmountOfMoney;
                            bill.Cards[index].AmountOfMoney = 0;
                        }
                        index++;
                    }
                }
            }
            else if(type == "card")
            {
                var card = bill.Cards.FirstOrDefault(c => c.CardNumber == cardNumber) ?? throw new Exception("Неверный номер карты");
                if(card.AmountOfMoney < amountOfMoney)
                {
                    throw new Exception("Недостаточно средств на карте");
                }
                else
                {
                    bill.AmountOfMoney -= amountOfMoney;
                    card.AmountOfMoney -= amountOfMoney;
                }
            }

            credit.LeftToPay -= amountOfMoney;
            credit.LeftToPayThisMonth -= amountOfMoney;

            await _db.SaveChangesAsync();

            return credit.CreditId;
        }
        public async Task<Guid> UpdateDebt(Guid creditId, Credit updatedCredit)
        {
            var credit = await _db.Credits
                .FirstOrDefaultAsync(c => c.CreditId == creditId)
                ?? throw new Exception("Кредит не найден");

            var updatedCreditEntity = new CreditEntity
            {
                CreditId = updatedCredit.CreditId,
                DateStart = updatedCredit.DateStart,
                MonthToPay = updatedCredit.MonthToPay,
                AmountOfMoney = updatedCredit.AmountOfMoney,
                Procents = updatedCredit.Procents,
                LeftToPay = updatedCredit.LeftToPay,
                LeftToPayThisMonth = updatedCredit.LeftToPayThisMonth,
                BillId = updatedCredit.BillId,
            };

            credit = updatedCreditEntity;

            await _db.SaveChangesAsync();

            return credit.CreditId;
        }
        public async Task<Guid> UpdateAllInf(Guid creditId, string dateStart, int monthToPay, decimal amountOfMoney, int procents)
        {
            var credit = await _db.Credits
                .FirstOrDefaultAsync(c => c.CreditId == creditId)
                ?? throw new Exception("Кредит не найден");

            credit.DateStart = dateStart;
            credit.MonthToPay = monthToPay;
            credit.AmountOfMoney = amountOfMoney;
            credit.Procents = procents;

            await _db.SaveChangesAsync();

            return credit.CreditId;
        }
        public async Task<List<Credit>> Get()
        {
            var creditEntities = await _db.Credits
                .AsNoTracking()
                .ToListAsync();

            var credits = creditEntities
                .Select(c => Credit.Create(c.CreditId, c.DateStart, c.MonthToPay, c.AmountOfMoney, c.Procents, c.LeftToPay, c.LeftToPayThisMonth, c.Endorsement, c.BillId))
                .ToList();

            return credits;
        }
        public async Task<List<Credit>> GetAllByBill(Guid billId)
        {
            var bill = await _db.Bills
                .Include(c => c.Credits)
                .FirstOrDefaultAsync(b => b.BillId == billId)
                ?? throw new Exception("Счет не найден");

            var credits = bill.Credits
                .Select(c => Credit.Create(c.CreditId, c.DateStart, c.MonthToPay, c.AmountOfMoney, c.Procents, c.LeftToPay, c.LeftToPayThisMonth, c.Endorsement, c.BillId))
                .ToList();

            return credits;
        }
        public async Task<Credit> GetOneById(Guid creditId)
        {
            var creditEntity = await _db.Credits.FindAsync(creditId) ?? throw new Exception("Кредит не найдена");

            var credit = Credit.Create(creditEntity.CreditId, creditEntity.DateStart, creditEntity.MonthToPay, creditEntity.AmountOfMoney, creditEntity.Procents, creditEntity.LeftToPay, creditEntity.LeftToPayThisMonth, creditEntity.Endorsement, creditEntity.BillId);

            return credit;
        }
        public async Task<Guid> Delete(Guid creditId)
        {
            await _db.Credits
                .Where(c => c.CreditId == creditId)
                .ExecuteDeleteAsync();

            return creditId;
        }
    }
}
