namespace BankProject.Core.Models
{
    public class Bill
    {
        private Bill(Guid id, string billNumber, string currency, decimal amountOfMoney, decimal amountOfMoneyUnAllocated, Guid bankAccountId)
        {
            BillId = id;
            BillNumber = billNumber;
            Currency = currency;
            AmountOfMoney = amountOfMoney;
            AmountOfMoneyUnAllocated = amountOfMoneyUnAllocated;
            BankAccountId = bankAccountId;
        }
        public Bill()
        {
            BillId = Guid.Empty;
            BillNumber = string.Empty;
            Currency = string.Empty;
            AmountOfMoney = 0;
            AmountOfMoneyUnAllocated = 0;
            BankAccountId = Guid.Empty;
        }
        public Guid BillId { get; set; }
        public string BillNumber { get; set; } = string.Empty;
        public string Currency { get; set; } = string.Empty;
        public decimal AmountOfMoney { get; set; }
        public decimal AmountOfMoneyUnAllocated { get; set; }
        public Guid BankAccountId { get; set; }
        public static Bill Create(Guid id, string billNumber, string currency, decimal amountOfMoney, decimal amountOfMoneyUnAllocated, Guid bankAccountId)
        {
            if(string.IsNullOrEmpty(billNumber) || string.IsNullOrEmpty(currency))
            {
                throw new Exception("Пустое поле");
            }

            var bill = new Bill(id, billNumber, currency, amountOfMoney, amountOfMoneyUnAllocated, bankAccountId);

            return bill;
        }
    }
}
