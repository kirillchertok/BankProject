namespace BankProject.Core.Models
{
    public class BankAccount
    {
        private BankAccount(Guid id, bool banned, Guid userId)
        {
            BankAccountId = id;
            IsBanned = banned;
            UserId = userId;
        }
        public BankAccount()
        {
            BankAccountId = Guid.Empty;
            IsBanned = false;
            UserId = Guid.Empty;
        }
        public Guid BankAccountId { get; set; }
        public bool IsBanned { get; set; }
        public Guid UserId { get; set; }
        public static BankAccount Create(Guid id, bool banned, Guid userId)
        {
            var bankAccount = new BankAccount(id, banned, userId);

            return bankAccount;
        }
    }
}