using BankProject.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface ICreditValueService
    {
        public Task<(Guid, string)> AddCreditValue(string currency, int month, decimal amountOfMoney);
        public Task<(List<CreditValue>, string)> GetAllCreditValues();
        public Task<(Guid, string)> UpdateCreditValue(string currency, int month, decimal amountOfMoney);
    }
}
