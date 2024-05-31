using BankProject.Application.Interfaces;
using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;

namespace BankProject.Application.Services.AccountServices
{
    public class CreditService : ICreditService
    {
        private readonly ICredits _credits;
        private readonly IBills _bills;
        private readonly IAdminMessage _adminMessage;
        private readonly IMailService _mailService;
        public CreditService(ICredits credits, IBills bills, IAdminMessage adminMessage, IMailService mailService)
        {
            _bills = bills;
            _credits = credits;
            _adminMessage = adminMessage;
            _mailService = mailService;
        }
        private decimal CalculateDebt(int monthToPay, decimal amountOfMoney, int procents, decimal lefttoPay)
        {
            var principalDebt = amountOfMoney / monthToPay;

            DateTime date = DateTime.Now;

            int daysInMonths = System.DateTime.DaysInMonth(date.Year, date.Month);
            int daysInYear = System.DateTime.IsLeapYear(date.Year) ? 366 : 365;

            var procentsDept = (lefttoPay * (procents/100) * daysInMonths) / daysInYear;

            return Math.Ceiling(procentsDept + principalDebt);
        }
        public async Task<(Credit, string)> TryAdd(Guid billId, Guid userId, string dateStart, int monthToPay, decimal amountOfMoney, int procents, decimal salary)
        {
            try
            {
                var toPay = amountOfMoney + ((amountOfMoney * procents) / 100);
                var debtThisMonth = CalculateDebt(monthToPay, amountOfMoney, procents, toPay);

                var credit = Credit.Create(Guid.NewGuid(), dateStart, monthToPay, amountOfMoney, procents, toPay, debtThisMonth, false, billId);

                var id = await _credits.Add(billId, credit);

                DateTime date = DateTime.Now;
                var idMessage = await _adminMessage.Add(AdminMessage.Create(
                    Guid.NewGuid(), 
                    "Одобрение кредита", 
                    $"Дата заявки: {dateStart}/Сумма: {amountOfMoney}/Зароботная плата: {salary}", 
                    [$"Id пользователя/{userId}", $"Id счета/{billId}", $"Id кредита/{credit.CreditId}"],
                    false,
                    date.ToString()
                    ));

                return (credit, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new Credit(), ex.Message);
            }
        }
        public async Task<(Guid, string)> ChangeCreditStatus(Guid userId, Guid messageId, Guid creditId, bool status)
        {
            try
            {
                var (credit, errorC) = await this.GetOneCreditById(creditId);

                if (errorC != "OK")
                {
                    throw new Exception(errorC);
                }

                var idC = await _credits.UpdateStatus(creditId, status);

                if (status)
                {
                    var idB = await _bills.AddCreditMoney(credit.BillId, credit.AmountOfMoney);
                }

                var sendMail = await _mailService.SendCreditStatusMail(userId, status);

                if (sendMail != "OK")
                {
                    throw new Exception(sendMail);
                }

                var idM = await _adminMessage.UpdateStatus(messageId, status);

                return (idC, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(List<Credit>, string)> GetAllCredits()
        {
            try
            {
                var credits = await _credits.Get();

                DateTime date = DateTime.Now;
                if (date.Day == 1)
                {
                    foreach (var credit in credits)
                    {
                        if (credit.Endorsement)
                        {
                            var (id, error) = await UpdateCreditDebt(credit.CreditId);

                            if (error != "OK")
                            {
                                throw new Exception(error);
                            }
                        }
                    }

                    var newCredits = await _credits.Get();

                    return (newCredits, "OK");
                }

                return (credits, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Credit>(), ex.Message);
            }
        }
        public async Task<(List<Credit>, string)> GetAllCreditsByBill(Guid billId)
        {
            try
            {
                var credits = await _credits.GetAllByBill(billId);

                return (credits, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<Credit>(), ex.Message);
            }
        }
        public async Task<(Credit, string)> GetOneCreditById(Guid creditId)
        {
            try
            {
                var credit = await _credits.GetOneById(creditId);

                return (credit, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new Credit(), ex.Message);
            }
        }
        public async Task<(Guid, string)> DeleteCredit(Guid creditId)
        {
            try
            {
                var id = await _credits.Delete(creditId);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> UpdateCreditPayment(Guid billId, Guid creditId, decimal amountOfMoney, string cardNumber, string type)
        {
            try
            {
                var id = await _credits.UpdatePayment(billId, creditId, amountOfMoney, cardNumber, type);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> UpdateCreditDebt(Guid creditId)
        {
            try
            {
                var (credit, error) = await GetOneCreditById(creditId);

                if(error != "OK")
                {
                    throw new Exception(error);
                }

                if(credit.LeftToPayThisMonth != 0 )
                {
                    credit.LeftToPay += credit.LeftToPayThisMonth;
                    credit.LeftToPayThisMonth = 0;
                }

                credit.LeftToPayThisMonth = CalculateDebt(credit.MonthToPay, credit.AmountOfMoney, credit.Procents, credit.LeftToPay);

                var id = await _credits.UpdateDebt(creditId, credit);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> UpdateApplicationInf(Guid creditId, string dateStart, int monthToPay, decimal amountOfMoney, int procents)
        {
            try
            {
                var id = await _credits.UpdateAllInf(creditId, dateStart, monthToPay, amountOfMoney, procents);

                var creditid = await _adminMessage.UpdateCreditApplicationInf(creditId, dateStart, amountOfMoney);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Credit, string)> GetOneCredit(Guid creditId)
        {
            try
            {
                var credit = await _credits.GetOneById(creditId);

                return (credit, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new Credit(), ex.Message);
            }
        }
    }
}
