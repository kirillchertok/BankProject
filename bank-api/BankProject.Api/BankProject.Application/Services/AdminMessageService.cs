using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.Application.Services
{
    public class AdminMessageService : IAdminMessageService
    {
        private readonly IAdminMessage _adminMessage;
        public AdminMessageService(IAdminMessage adminMessage)
        {
            _adminMessage = adminMessage;
        }
        public async Task<(List<AdminMessage>, string)> GetAllMessages()
        {
            try
            {
                var messages = await _adminMessage.GetAll();

                return (messages, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new List<AdminMessage>(), ex.Message);
            }
        }
        public async Task<(Guid, string)> UpdateMessageStatus(Guid messageId, bool status)
        {
            try
            {
                var id = await _adminMessage.UpdateStatus(messageId, status);

                return (id, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
        public async Task<(Guid, string)> CreateMessageToUnban(Guid userId)
        {
            try
            {
                var exist = await _adminMessage.CheckExistToUnban(userId);
                if (exist)
                {
                    return (Guid.Empty, "Заявка уже подана");
                }
                DateTime date = DateTime.Now;
                var idMessage = await _adminMessage.Add(AdminMessage.Create(
                    Guid.NewGuid(),
                    "Заяка на разблокировку",
                    "Нет нужных дополнительных данных",
                    [$"Id пользователя/{userId}"],
                    false,
                    date.ToString()
                    ));

                return (idMessage, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, ex.Message);
            }
        }
    }
}
