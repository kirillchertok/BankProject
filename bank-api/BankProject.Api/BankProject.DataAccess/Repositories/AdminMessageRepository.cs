using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Models;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.DataAccess.Repositories
{
    public class AdminMessageRepository : IAdminMessage
    {
        private readonly BankProjectDbContext _db;
        public AdminMessageRepository(BankProjectDbContext db)
        {
            _db = db;
        }
        public async Task<Guid> Add(AdminMessage adminMessage)
        {
            var adminMessageEntity = new AdminMessageEntity
            {
                MessageId = adminMessage.MessageId,
                MessageTitle = adminMessage.MessageTitle,
                Message = adminMessage.Message,
                ConnectedId = adminMessage.ConnectedId,
                IsDone = adminMessage.IsDone,
                DateCreate = adminMessage.DateCreate,
            };

            await _db.AdminMessages.AddAsync(adminMessageEntity);

            await _db.SaveChangesAsync();

            return adminMessageEntity.MessageId;
        }
        public async Task<List<AdminMessage>> GetAll()
        {
            var adminMessageEntities = await _db.AdminMessages
                .AsNoTracking()
                .ToListAsync();

            var adminMessages = adminMessageEntities
                .Select(m => AdminMessage.Create(m.MessageId, m.MessageTitle, m.Message, m.ConnectedId, m.IsDone, m.DateCreate))
                .ToList();

            return adminMessages;
        }
        public async Task<Guid> UpdateStatus(Guid messageId, bool status)
        {
            var adminMessage = await _db.AdminMessages
                .FirstOrDefaultAsync(m => m.MessageId == messageId)
                ?? throw new Exception("Сообщение не найдено");

            adminMessage.IsDone = status;

            return adminMessage.MessageId;
        }
        public async Task<AdminMessage> GetOneById(Guid messageid)
        {
            var adminMessageEntity = await _db.AdminMessages
                .FirstOrDefaultAsync(m => m.MessageId == messageid)
                ?? throw new Exception("Сообщение не найдено");

            return AdminMessage.Create(adminMessageEntity.MessageId, adminMessageEntity.MessageTitle, adminMessageEntity.Message, adminMessageEntity.ConnectedId, adminMessageEntity.IsDone,adminMessageEntity.DateCreate);
        }
        public async Task<bool> CheckExistToUnban(Guid userId)
        {
            var adminMessageEntities = await _db.AdminMessages
                .AsNoTracking()
                .ToListAsync();

            foreach (var message in adminMessageEntities)
            {
                if (message.MessageTitle == "Заяка на разблокировку")
                {
                    if (Guid.Parse(message.ConnectedId[0].Split("/")[1]) == userId)
                    {
                        return true;
                    }
                }
            }

            return false;
        }
        public async Task<Guid> UpdateCreditApplicationInf(Guid creditId, string dateStart, decimal amountOfMoney)
        {
            var adminMessages = await _db.AdminMessages
                .ToListAsync();

            foreach (var message in adminMessages)
            {
                if (message.MessageTitle == "Одобрение кредита" && !message.IsDone)
                {
                    if (Guid.Parse(message.ConnectedId[2].Split('/')[1]) == creditId)
                    {
                        DateTime date = DateTime.Now;
                        var inf = message.Message.Split("-");
                        message.Message = $"Дата заявки: {dateStart}-Сумма: {amountOfMoney}-{inf[2]}";
                        message.DateCreate = date.ToString();
                    }
                }
            }

            await _db.SaveChangesAsync();

            return creditId;
        }
        public async Task<Guid> Delete(Guid messageId)
        {
            await _db.AdminMessages
                .Where(m => m.MessageId == messageId)
                .ExecuteDeleteAsync();

            return messageId;
        }
    }
}
