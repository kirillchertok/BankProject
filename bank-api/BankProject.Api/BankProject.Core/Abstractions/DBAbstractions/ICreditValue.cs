using BankProject.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface ICreditValue
    {
        public Task<Guid> Add(CreditValue creditValue);
        public Task<List<CreditValue>> Get();
        public Task<Guid> Update(string currency, int month, decimal moneyValue);
    }
}
