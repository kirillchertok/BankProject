namespace BankProject.DataAccess.Entities
{
    public class BillEntity
    {
        public Guid BillId { get; set; }
        public string BillNumber { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public decimal AmountOfMoney { get; set; }
        public decimal AmountOfMoneyUnAllocated { get; set; }
        public List<CardEntity> Cards { get; set; } = [];
        public List<TransactionEntity> Transactions { get; set; } = [];
        public List<CreditEntity> Credits { get; set; } = [];
        public Guid BankAccountId { get; set; }
        public BankAccountEntity? BankAccount { get; set; }
    }
}
