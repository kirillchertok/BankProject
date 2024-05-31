using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface ICardService
    {
        public Task<(string, string)> AddCard(Guid billId, string paymentSystem, string pinCode, string CVV, string color, string userName);
        public Task<(List<Card>, string)> GetAllCards();
        public Task<(List<Card>, string)> GetAllBillCards(Guid billId);
        public Task<(Card, string)> GetCardById(Guid cardId);
        public Task<(Guid, string)> DeleteCard(Guid cardId);
    }
}
