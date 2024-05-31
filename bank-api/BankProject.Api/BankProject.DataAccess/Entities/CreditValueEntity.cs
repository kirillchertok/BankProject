using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.DataAccess.Entities
{
    public class CreditValueEntity
    {
        public Guid CreditValueId { get; set; }
        public string Currency {  get; set; } = string.Empty;
        public int Month {  get; set; }
        public decimal MoneyValue { get; set; }
    }
}
