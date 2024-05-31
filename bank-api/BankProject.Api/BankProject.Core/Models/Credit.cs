namespace BankProject.Core.Models
{
    public class Credit
    {
        private Credit(Guid id, string dateStart, int monthToPay, decimal amountOfMoney, int procents, decimal leftToPay, decimal leftToPayThisMonth, bool endorsement, Guid billid)
        {
            CreditId = id;
            DateStart = dateStart;
            MonthToPay = monthToPay;
            AmountOfMoney = amountOfMoney;
            Procents = procents;
            LeftToPay = leftToPay;
            LeftToPayThisMonth = leftToPayThisMonth;
            Endorsement = endorsement;
            BillId = billid;
        }
        public Credit()
        {
            CreditId = Guid.Empty;
            DateStart = string.Empty;
            MonthToPay = 0;
            AmountOfMoney = 0;
            Procents = 0;
            LeftToPay = 0;
            LeftToPayThisMonth = 0;
            Endorsement = false;
            BillId = Guid.Empty;
        }
        public Guid CreditId { get; set; }
        public string DateStart { get; set; } = string.Empty;
        public int MonthToPay { get; set; }
        public decimal AmountOfMoney { get; set; }
        public int Procents { get; set; }
        public decimal LeftToPay { get; set; }
        public decimal LeftToPayThisMonth { get; set; }
        public bool Endorsement { get; set; }
        public Guid BillId { get; set; }
        public static Credit Create(Guid id, string dateStart, int monthToPay, decimal amountOfMoney, int procents, decimal leftToPay, decimal leftToPayThisMonth, bool endorsement, Guid billid)
        {
            if(string.IsNullOrEmpty(dateStart))
            {
                throw new Exception("Пустое поле");
            }

            var credit = new Credit(id, dateStart, monthToPay, amountOfMoney, procents, leftToPay, leftToPayThisMonth, endorsement, billid);

            return credit;
        }
    }
}
