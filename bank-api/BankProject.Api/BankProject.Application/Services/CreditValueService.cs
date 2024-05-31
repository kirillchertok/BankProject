using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;

namespace BankProject.Application.Services
{
    public class CreditValueService : ICreditValueService
    {
        private readonly ICreditValue _creditValue;
        public CreditValueService(ICreditValue creditValue)
        {
            _creditValue = creditValue;
        }
        public async Task<(Guid, string)> AddCreditValue(string currency, int month, decimal amountOfMoney)
        {
            try
            {
                var id = await _creditValue.Add(CreditValue.Create(Guid.NewGuid(), currency, month, amountOfMoney));

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(List<CreditValue>, string)> GetAllCreditValues()
        {
            try
            {
                var creditValues = await _creditValue.Get();

                return (creditValues, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<CreditValue>(), ex.Message);
            }
        }
        public async Task<(Guid, string)> UpdateCreditValue(string currency, int month, decimal amountOfMoney)
        {
            try
            {
                var id = await _creditValue.Update(currency, month, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
    }
}
