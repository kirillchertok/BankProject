namespace BankProject.Application.Infrastructure.Jwt
{
    public class JwtOptions
    {
        public string SecretKey { get; set; } = string.Empty;
        public int ExpitesHours { get; set; }
        public int ExpiresHoursRefresh { get; set; }
    }
}
