using BankProject.Core.Models;

namespace BankProject.Core.Abstractions.DBAbstractions
{
    public interface IAdminMessage
    {
        public Task<Guid> Add(AdminMessage adminMessage);
        public Task<List<AdminMessage>> GetAll();
        public Task<Guid> UpdateStatus(Guid messageId, bool status);
        public Task<AdminMessage> GetOneById(Guid messageid);
        public Task<bool> CheckExistToUnban(Guid userId);
        public Task<Guid> UpdateCreditApplicationInf(Guid creditId, string dateStart, decimal amountOfMoney);
        public Task<Guid> Delete(Guid messageId);
    }
}
