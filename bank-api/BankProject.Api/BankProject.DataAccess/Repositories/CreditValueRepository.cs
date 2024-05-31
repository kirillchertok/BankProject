using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Repositories
{
    public class CreditValueRepository : ICreditValue
    {
        private readonly BankProjectDbContext _db;
        public CreditValueRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> Add(CreditValue creditValue)
        {
            var creditValueEntity = new CreditValueEntity
            {
                CreditValueId = creditValue.CreditValueId,
                Currency = creditValue.Currency,
                Month = creditValue.Month,
                MoneyValue = creditValue.MoneyValue
            };

            await _db.CreditValues.AddAsync(creditValueEntity);

            await _db.SaveChangesAsync();

            return creditValue.CreditValueId;
        }
        public async Task<List<CreditValue>> Get()
        {
            var creditValueEntities = await _db.CreditValues
                .AsNoTracking()
                .ToListAsync();

            var creditValues = creditValueEntities
                .Select(cv => CreditValue.Create(cv.CreditValueId, cv.Currency, cv.Month, cv.MoneyValue))
                .ToList();

            return creditValues;
        }
        public async Task<Guid> Update(string currency, int month, decimal moneyValue)
        {
            var credit = await _db.CreditValues
                .FirstOrDefaultAsync(cv => cv.Currency == currency && cv.Month == month)
                ?? throw new Exception("Кредитная ставка не найдена");

            Console.WriteLine("--------------------");
            Console.WriteLine(currency);
            Console.WriteLine(month);
            Console.WriteLine(moneyValue);
            Console.WriteLine("--------------------");

            credit.MoneyValue = moneyValue;

            await _db.SaveChangesAsync();

            return credit.CreditValueId;
        }
    }
}
