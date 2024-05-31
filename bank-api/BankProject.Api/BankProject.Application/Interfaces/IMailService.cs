namespace BankProject.Application.Interfaces
{
    public interface IMailService
    {
        public Task<string> SendAuthMail(Guid id);
        public Task<string> SendCreditStatusMail(Guid userId, bool status);
        public string GenerateCode();
    }
}
