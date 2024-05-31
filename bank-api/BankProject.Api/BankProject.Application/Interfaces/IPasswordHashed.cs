namespace BankProject.Application.Interfaces
{
    public interface IPasswordHashed
    {
        public string Generate(string password);
        public bool Verify(string password, string hashedPassword);
    }
}
