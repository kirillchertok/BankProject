namespace BankProject.DataAccess.Entities
{
    public class CardEntity
    {
        public Guid CardId { get; set; }
        public decimal AmountOfMoney { get; set; }
        public string CardNumber { get; set; } = string.Empty;
        public string PinCode { get; set; } = string.Empty;
        public string CVV { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string EndDate { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public Guid BillId { get; set; }
        public BillEntity? Bill { get; set; }
    }
}
