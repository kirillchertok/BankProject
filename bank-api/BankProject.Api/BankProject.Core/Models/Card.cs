namespace BankProject.Core.Models
{
    public class Card
    {
        private Card(Guid id, string cardNumber, string pinCode, string cvv, decimal amountOfMoney, string color, string endDate, string userName, Guid billId)
        {
            CardId = id;
            CardNumber = cardNumber;
            PinCode = pinCode;
            CVV = cvv;
            AmountOfMoney = amountOfMoney;
            Color = color;
            EndDate = endDate;
            UserName = userName;
            BillId = billId;
        }
        public Card()
        {
            CardId = Guid.Empty;
            AmountOfMoney = 0;
            CardNumber = string.Empty;
            Color = string.Empty;
            EndDate = string.Empty;
            UserName = string.Empty;
            BillId = Guid.Empty;
        }
        public Guid CardId { get; set; }
        public decimal AmountOfMoney { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public Guid BillId { get; set; }
        public static Card Create(Guid id, string cardNumber, string pinCode, string cvv, decimal amountOfMoney, string color, string endDate, string userName, Guid billId)
        {
            if(string.IsNullOrEmpty(color) || string.IsNullOrEmpty(endDate) || string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(cardNumber) || string.IsNullOrEmpty(pinCode) || string.IsNullOrEmpty(cvv))
            {
                throw new Exception("Пустое поле");
            }

            var card = new Card(id, cardNumber, pinCode, cvv, amountOfMoney, color, endDate, userName, billId);

            return card;
        }
    }
}
