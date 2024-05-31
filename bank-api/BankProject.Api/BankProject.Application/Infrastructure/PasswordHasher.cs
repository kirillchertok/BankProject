using BankProject.Application.Interfaces;

namespace BankProject.Application.Infrastructure
{
    public class PasswordHasher : IPasswordHashed
    {
        public string Generate(string password) =>
            BCrypt.Net.BCrypt.EnhancedHashPassword(password);

        public bool Verify(string password, string hashedPassword) =>
            BCrypt.Net.BCrypt.EnhancedVerify(password, hashedPassword);
    }
}
