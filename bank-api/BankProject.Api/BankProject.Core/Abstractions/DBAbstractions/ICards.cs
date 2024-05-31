using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface ICards
    {
        public Task<string> Add(Guid billId, Card card);
        public  Task<List<Card>> Get();
        public Task<List<Card>> GetAllByBill(Guid billId);
        public Task<Card> GetOneById(Guid cardId);
        public Task<Guid> Delete(Guid cardId);
    }
}
