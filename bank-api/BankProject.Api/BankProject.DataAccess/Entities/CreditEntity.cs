namespace BankProject.DataAccess.Entities
{
    public class CreditEntity
    {
        public Guid CreditId { get; set; }
        public string DateStart { get; set; } = string.Empty;
        public int MonthToPay { get; set; }
        public decimal AmountOfMoney { get; set; }
        public int Procents { get; set; }
        public decimal LeftToPay { get; set; }
        public decimal LeftToPayThisMonth { get; set; }
        public bool Endorsement { get; set; }
        public Guid BillId { get; set; }
        public BillEntity? Bill { get; set; }
    }
}
