namespace BankProject.Core.Models
{
    public class TransactionUser
    {
        private TransactionUser(
            string date,
            string senderBillNumber,
            string? senderCardId,
            string receiverBillNumber,
            string? receiverCardId,
            decimal amountOfMoney)
        {
            Date = date;
            SenderBillNumber = senderBillNumber;
            SenderCard = senderCardId;
            ReceiverBillNumber = receiverBillNumber;
            ReceiverCard = receiverCardId;
            AmountOfMoney = amountOfMoney;
        }
        public string Date { get; set; } = string.Empty;
        public string? SenderBillNumber { get; set; } = string.Empty;
        public string? SenderCard { get; set; } = string.Empty;
        public string? ReceiverBillNumber { get; set; } = string.Empty;
        public string? ReceiverCard { get; set; } = string.Empty;
        public decimal AmountOfMoney { get; set; }
        public static TransactionUser Create(
            string date,
            string senderBillNumber,
            string? senderCard,
            string receiverBillNumber,
            string? receiverCard,
            decimal amountOfMoney)
        {
            if (string.IsNullOrEmpty(date) || string.IsNullOrEmpty(senderBillNumber) || string.IsNullOrEmpty(receiverBillNumber))
            {
                throw new Exception("Пустое поле");
            }

            var transaction = new TransactionUser(date, senderBillNumber, senderCard, receiverBillNumber, receiverCard, amountOfMoney);

            return transaction;
        }
    }
}
