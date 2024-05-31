using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using System.Globalization;

namespace BankProject.Application.Services.AccountServices
{
    public class BillService : IBillService
    {
        private readonly IBills _bills;
        public BillService(IBills bills)
        {
            _bills = bills;
        }
        private static string GenerateBillNumber(string currency, string role, string puspose)
        {
            var billNumber = "";

            if(role == "Физ. лицо")
            {
                billNumber += "408";

                if(puspose == "Переводы и хранение средств")
                {
                    billNumber += "17";
                }
                else if(puspose == "Предпринимательство")
                {
                    billNumber += "02";
                }
            }
            else if(role == "Компания")
            {
                billNumber += "407";

                if(puspose == "Финансовые услуги")
                {
                    billNumber += "01";
                }
                else if(puspose == "Некоммерческая деятельность")
                {
                    billNumber += "03";
                }
            }
            else if(role == "Гос. организация")
            {
                billNumber += "40500";
            }

            if (currency == "USD")
            {
                billNumber += "840";
            }
            else if(currency == "EUR")
            {
                billNumber += "978";
            }
            else if(currency == "RUB")
            {
                billNumber += "810";
            }
            else if(currency == "BYN")
            {
                billNumber += "933";
            }

            decimal tmp = 0;
            foreach(char item in billNumber)
            {
                tmp += Convert.ToInt32(item);
            }
            tmp /= 100;

            billNumber += (Math.Round(tmp)).ToString();

            Random rnd = new Random();
            int departmentNumber = rnd.Next(0, 9);

            billNumber += "000";
            billNumber += departmentNumber.ToString();

            int rndNumber = rnd.Next(1111111, 9999999);

            billNumber += rndNumber.ToString();

            return billNumber;
        }
        public async Task<(Guid, string)> AddBill(Guid bankAccountId,string currency, string role, string puspose)
        {
            try
            {
                var bill = Bill.Create(Guid.NewGuid(), GenerateBillNumber(currency, role, puspose), currency, 10000, 0, bankAccountId);

                var id = await _bills.Add(bankAccountId, bill);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(List<Bill>, string)> GetAllBills()
        {
            try
            {
                var bills = await _bills.Get();

                return (bills, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Bill>(), ex.Message);
            }
        }
        public async Task<(List<Bill>, string)> GetAllAccountBills(Guid bankAccountId)
        {
            try
            {
                var bills = await _bills.GetAllByAccount(bankAccountId);

                return (bills, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Bill>(), ex.Message);
            }
        }
        public async Task<(Bill, string)> GetBillById(Guid billId)
        {
            try
            {
                var bill = await _bills.GetOneById(billId);

                return (bill, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new Bill(), ex.Message);
            }
        }
        public async Task<(Guid, string)> AddCreditMoney(Guid billId,decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.AddCreditMoney(billId, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddUnAllocatedMoney(Guid billId, decimal amounntOfMoney, string cardNumber)
        {
            try
            {
                var id = await _bills.AddUnAllocatedMoney(billId, amounntOfMoney, cardNumber);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> SendMoneyCardCard(Guid billId, Guid cardSId, Guid cardRId, decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.SendMoneyCardCard(billId, cardSId, cardRId, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddMoneyToBill(Guid billId, decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.AddMoney(billId, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> AddMoneyToBillUnAllocated(Guid billId, decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.AddMoneyUnAllocated(billId, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> RemoveMoneyFromBill(Guid billId, decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.RemoveMoney(billId, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> RemoveMoneyFromBillUnAllocated(Guid billId, decimal amountOfMoney)
        {
            try
            {
                var id = await _bills.RemoveMoneyUnAllocated(billId, amountOfMoney);

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
