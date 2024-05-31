using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.Core.Models
{
    public class CreditValue
    {
        public CreditValue(Guid creditValueId, string currency, int month, decimal moneyValue)
        {
            CreditValueId = creditValueId;
            Currency = currency;
            Month = month;
            MoneyValue = moneyValue;
        }
        public Guid CreditValueId { get; set; }
        public string Currency { get; set; } = string.Empty;
        public int Month { get; set; }
        public decimal MoneyValue { get; set; }
        public static CreditValue Create(Guid creditValueId, string currency, int month, decimal moneyValue)
        {
            var creditValue = new CreditValue(creditValueId, currency, month, moneyValue);

            return creditValue;
        }
    }
}
