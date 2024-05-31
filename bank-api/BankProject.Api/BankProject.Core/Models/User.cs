namespace BankProject.Core.Models
{
    public class User
    {
        private User(
            Guid id, 
            string name, 
            string secondname, 
            string phoneNumber, 
            string email, 
            bool tfAuth, 
            string role,
            string passportNumber,
            string birthdayDate,
            string passportId,
            string password,
            string token = "")
        {
            Id = id;
            Name = name;
            SecondName = secondname;
            PhoneNumber = phoneNumber;
            Email = email;
            TfAuth = tfAuth;
            Role = role;
            PassportNumber = passportNumber;
            BirthdayDate = birthdayDate;
            PassportId = passportId;
            Password = password;
        }
        public User()
        {
            Id = Guid.NewGuid();
            Name = string.Empty;
            SecondName = string.Empty;
            PhoneNumber = string.Empty;
            Email = string.Empty;
            TfAuth = false;
            Role  = string.Empty;
            PassportNumber = string.Empty;
            BirthdayDate = string.Empty;
            PassportId= string.Empty;
            Password= string.Empty;
            RefreshToken = string.Empty;
        }
        public Guid Id { get; }
        public string Name { get;} = string.Empty;
        public string SecondName { get; } = string.Empty;
        public string PhoneNumber { get; } = string.Empty;
        public string Email { get; } = string.Empty;
        public bool TfAuth { get; }
        public string Role { get; } = string.Empty;
        public string PassportNumber { get; } = string.Empty;
        public string BirthdayDate { get; } = string.Empty;
        public string PassportId { get; } = string.Empty;
        public string Password { get; } = string.Empty;
        public string RefreshToken { get; } = string.Empty;

        public static User Create(
            Guid id, 
            string name, 
            string secondname, 
            string phoneNumber, 
            string email, 
            bool tfAuth, 
            string role,
            string passportNumber,
            string birthdayDate,
            string passportId,
            string password)
        {
            if (string.IsNullOrEmpty(name) || 
                string.IsNullOrEmpty(secondname) || 
                string.IsNullOrEmpty(phoneNumber) || 
                string.IsNullOrEmpty(email) || 
                string.IsNullOrEmpty(role) ||
                string.IsNullOrEmpty(passportNumber) ||
                string.IsNullOrEmpty(birthdayDate) ||
                string.IsNullOrEmpty(passportId) ||
                string.IsNullOrEmpty(password))
            {
                throw new Exception("Пустое поле");
            }

            var user = new User(id, name, secondname, phoneNumber, email, tfAuth, role, passportNumber, birthdayDate, passportId, password);
            
            return user;
        }
        public static User AddToken(User user,string token)
        {
            return new User(
                user.Id,
                user.Name,
                user.SecondName,
                user.PhoneNumber,
                user.Email,
                user.TfAuth,
                user.Role,
                user.PassportNumber,
                user.BirthdayDate,
                user.PassportId,
                user.Password,
                token);
        }
    }
}
