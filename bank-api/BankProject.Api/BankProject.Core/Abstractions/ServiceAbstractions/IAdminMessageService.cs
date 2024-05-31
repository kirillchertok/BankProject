using BankProject.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.Core.Abstractions.ServiceAbstractions
{
    public interface IAdminMessageService
    {
        public Task<(List<AdminMessage>, string)> GetAllMessages();
        public Task<(Guid, string)> UpdateMessageStatus(Guid messageId, bool status);
        public Task<(Guid, string)> CreateMessageToUnban(Guid userId);
    }
}
