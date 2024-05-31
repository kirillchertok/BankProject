namespace BankProject.Core.Models
{
    public class AdminMessage
    {
        private AdminMessage(Guid messageId, string messageTitle, string message, List<string> connectedId, bool isDone, string dateStart)
        {
            MessageId = messageId;
            MessageTitle = messageTitle;
            Message = message;
            ConnectedId = connectedId;
            IsDone = isDone;
            DateCreate = dateStart;
        }
        public Guid MessageId { get; }
        public string MessageTitle { get; } = string.Empty;
        public string Message { get; } = string.Empty;
        public List<string> ConnectedId { get; } = [];
        public bool IsDone { get; }
        public string DateCreate { get; } = string.Empty;
        public static AdminMessage Create(Guid messageId, string messageTitle, string message, List<string> connectedId, bool isDone, string dateStart)
        {
            if(string.IsNullOrEmpty(messageTitle) || string.IsNullOrEmpty(message))
            {
                throw new Exception("Пустое поле");
            }

            var adminMessage = new AdminMessage(messageId, messageTitle, message, connectedId, isDone, dateStart);

            return adminMessage;
        }
    }
}
