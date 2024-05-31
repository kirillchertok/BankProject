namespace BankProject.DataAccess.Entities
{
    public class AdminMessageEntity
    {
        public Guid MessageId { get; set; }
        public string MessageTitle { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public List<string> ConnectedId { get; set; } = [];
        public bool IsDone { get; set; }
        public string DateCreate { get; set; } = string.Empty;
    }
}
