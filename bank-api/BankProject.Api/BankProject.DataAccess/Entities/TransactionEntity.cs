namespace BankProject.DataAccess.Entities
{
    public class TransactionEntity
    {
        public Guid TransactionId { get; set; }
        public Guid TransactionIdAdmin { get; set; }
        public string Date { get; set; } = string.Empty;
        public Guid SenderBillId { get; set; }
        public string SenderBillNumber { get; set; } = string.Empty;
        public string? SenderCard { get; set; } = string.Empty;
        public Guid ReceiverBillId { get; set;}
        public string ReceiverBillNumber { get; set; } = string.Empty;
        public string? ReceiverCard { get; set; } = string.Empty;
        public decimal AmountOfMoney { get; set; }
        public Guid BillId { get; set; }
        public BillEntity? Bill { get; set; }
    }
}
