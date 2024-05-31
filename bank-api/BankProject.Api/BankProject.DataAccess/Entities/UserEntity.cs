namespace BankProject.DataAccess.Entities
{
    public class UserEntity
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SecondName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool TfAuth { get; set; }
        public string Role { get; set; } = string.Empty;
        public string PassportNumber { get; set; } = string.Empty;
        public string BirthdayDate { get; set; } = string.Empty;
        public string PassportId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string RefreshToken {  get; set; } = string.Empty;
        public Guid? BankAccountId { get; set; }
        public BankAccountEntity? BankAccount { get; set; }
    }
}
