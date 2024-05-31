using BankProject.Core.Models;

namespace BankProject.Application.Interfaces
{
    public interface IJwtProvider
    {
        public string GenerateAccessToken(User user);
        public string GenerateRefreshToken(User user);
        public bool ValidateToken(string token);
    }
}
