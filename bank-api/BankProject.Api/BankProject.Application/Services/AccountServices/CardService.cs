using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;

namespace BankProject.Application.Services.AccountServices
{
    public class CardService : ICardService
    {
        private readonly ICards _cards;
        public CardService(ICards cards)
        {
            _cards = cards;
        }
        private string GenerateCardNumber(string paymnetSystem)
        {
            string cardNumber = "";

            if(paymnetSystem == "VISA")
            {
                cardNumber += "4";
            }
            else if(paymnetSystem == "MasterCard")
            {
                cardNumber += "5";
            }
            else if(paymnetSystem == "МИР")
            {
                cardNumber += "2";
            }

            cardNumber += "13127";

            Random random = new Random();
            cardNumber += random.Next(100000000, 999999999).ToString();

            decimal tmp = 0;
            foreach (char item in cardNumber)
            {
                tmp += Convert.ToInt32(item);
            }
            tmp /= 1000;

            cardNumber += (Math.Round(tmp)).ToString();

            return cardNumber;
        }
        public async Task<(string, string)> AddCard(Guid billId, string paymentSystem, string pinCode, string CVV, string color, string userName)
        {
            try
            {
                DateTime date = DateTime.Now;
                var endDate = date.AddYears(5).ToString("dd/MM/yy").Substring(3, 5);

                var card = Card.Create(Guid.NewGuid(), GenerateCardNumber(paymentSystem), pinCode, CVV, 0, color, endDate, userName, billId);

                var cardnumber = await _cards.Add(billId, card);

                return (cardnumber, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (string.Empty, ex.Message);
            }
        }
        public async Task<(List<Card>, string)> GetAllCards()
        {
            try
            {
                var cards = await _cards.Get();

                return (cards, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Card>(), ex.Message);
            }
        }
        public async Task<(List<Card>, string)> GetAllBillCards(Guid billId)
        {
            try
            {
                var cards = await _cards.GetAllByBill(billId);

                return (cards, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Card>(), ex.Message);
            }
        }
        public async Task<(Card, string)> GetCardById(Guid cardId)
        {
            try
            {
                var card = await _cards.GetOneById(cardId);

                return (card, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new Card(), ex.Message);
            }
        }
        public async Task<(Guid, string)> DeleteCard(Guid cardId)
        {
            try
            {
                var id = await _cards.Delete(cardId);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
    }
}
