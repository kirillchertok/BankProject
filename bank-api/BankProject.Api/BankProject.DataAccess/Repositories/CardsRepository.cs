using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class CardsRepository : ICards
    {
        private readonly BankProjectDbContext _db;
        public CardsRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<string> Add(Guid billId, Card card)
        {
            var bill = await _db.Bills
                .Include(b => b.Cards)
                .FirstOrDefaultAsync(b => b.BillId == billId) ?? throw new Exception("Счет не найден");

            var cardEntity = new CardEntity
            {
                CardId = card.CardId,
                AmountOfMoney = (bill.Cards.Count == 0 ? bill.AmountOfMoney : 0),
                CardNumber = card.CardNumber,
                PinCode = card.PinCode,
                CVV = card.CVV,
                Color = card.Color,
                EndDate = card.EndDate,
                UserName = card.UserName,
                BillId = billId
            };

            await _db.Cards.AddAsync(cardEntity);
            await _db.SaveChangesAsync();

            return cardEntity.CardNumber;
        }
        public async Task<List<Card>> Get()
        {
            var cardEntities = await _db.Cards
                .AsNoTracking() 
                .ToListAsync();

            var cards = cardEntities
                .Select(c => Card.Create(c.CardId, c.CardNumber, c.PinCode, c.CVV, c.AmountOfMoney, c.Color, c.EndDate, c.UserName, c.BillId))
                .ToList();

            return cards;
        }
        public async Task<List<Card>> GetAllByBill(Guid billId)
        {
            var bill = await _db.Bills
                .AsNoTracking()
                .Include(c => c.Cards)
                .FirstOrDefaultAsync(b => b.BillId == billId) ?? throw new Exception("Счет не найден");

            Console.WriteLine("testerror");

            var cards = bill.Cards
                .Select(c => Card.Create(c.CardId, c.CardNumber, c.PinCode, c.CVV, c.AmountOfMoney, c.Color, c.EndDate, c.UserName, c.BillId))
                .ToList();

            Console.WriteLine("testerror");

            return cards;
        }
        public async Task<Card> GetOneById(Guid cardId)
        {
            var cardEntity = await _db.Cards.FindAsync(cardId) ?? throw new Exception("Карта не найдена");

            var card = Card.Create(cardEntity.CardId, cardEntity.CardNumber, cardEntity.PinCode, cardEntity.CVV, cardEntity.AmountOfMoney, cardEntity.Color, cardEntity.EndDate, cardEntity.UserName, cardEntity.BillId);

            return card;
        }
        public async Task<Guid> Delete(Guid cardId)
        {
            await _db.Cards
                .Where(c => c.CardId == cardId)
                .ExecuteDeleteAsync();

            return cardId;
        }
    }
}
