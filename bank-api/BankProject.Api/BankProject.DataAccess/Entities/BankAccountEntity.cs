namespace BankProject.DataAccess.Entities
{
    public class BankAccountEntity
    {
        public Guid BankAccountId { get; set; }
        public bool IsBanned { get; set; }
        public List<BillEntity> Bills { get; set; } = [];
        public Guid UserId { get; set; }
        public UserEntity? User { get; set; }
    }
}
