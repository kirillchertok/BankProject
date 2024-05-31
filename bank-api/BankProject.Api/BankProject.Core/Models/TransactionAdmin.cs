namespace BankProject.Core.Models
{
    public class TransactionAdmin
    {
        private TransactionAdmin(
            Guid transactionIdAdmin,
            Guid transaciondId, 
            string date, 
            Guid senderBillId, 
            string senderBillNumber,
            string? senderCardId, 
            Guid receiverBillId,
            string receiverBillNumber,
            string? receiverCardId,
            decimal amountOfMoney,
            Guid billId)
        {
            TransactionId = transaciondId;
            TransactionIdAdmin = transactionIdAdmin;
            Date = date;
            SenderBillId = senderBillId;
            SenderBillNumber = senderBillNumber;
            SenderCard = senderCardId;
            ReceiverBillId = receiverBillId;
            ReceiverBillNumber = receiverBillNumber;
            ReceiverCard = receiverCardId;
            AmountOfMoney = amountOfMoney;
            BillId = billId;
        }
        public TransactionAdmin()
        {
            TransactionId = Guid.Empty;
            TransactionIdAdmin = Guid.Empty;
            Date = string.Empty;
            SenderBillId = Guid.Empty;
            SenderBillNumber = string.Empty;
            SenderCard = string.Empty;
            ReceiverBillId = Guid.Empty;
            ReceiverBillNumber = string.Empty;
            ReceiverCard = string.Empty;
            AmountOfMoney = 0;
            BillId = Guid.Empty;
        }
        public Guid TransactionId { get; set; }
        public Guid TransactionIdAdmin { get; set; }
        public string Date { get; set; } = string.Empty;
        public Guid SenderBillId { get; set; }
        public string? SenderBillNumber { get; set; } = string.Empty;
        public string? SenderCard { get; set; } = string.Empty;
        public Guid ReceiverBillId { get; set; }
        public string? ReceiverBillNumber { get; set; } = string.Empty;
        public string? ReceiverCard { get; set; } = string.Empty;
        public decimal AmountOfMoney { get; set; }
        public Guid? BillId { get; set; }
        public static TransactionAdmin Create(
            Guid transacionIdAdmin,
            Guid transactionId,
            string date,
            Guid senderBillId,
            string senderBillNumber,
            string? senderCard,
            Guid receiverBillId,
            string receiverBillNumber,
            string? receiverCard,
            decimal amountOfMoney,
            Guid billId)
        {
            if(string.IsNullOrEmpty(date))
            {
                throw new Exception("Пустое поле");
            }

            var transaction = new TransactionAdmin(transacionIdAdmin, transactionId, date, senderBillId, senderBillNumber, senderCard, receiverBillId, receiverBillNumber, receiverCard, amountOfMoney, billId);

            return transaction;
        }
    }
}
