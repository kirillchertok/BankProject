using BankProject.Application.Infrastructure;
using Microsoft.Extensions.Options;
using MailKit.Net.Smtp;
using IMailService = BankProject.Application.Interfaces.IMailService;
using System.Net.Mail;
using System.Net;
using BankProject.Core.Abstractions.DBAbstractions;

namespace BankProject.Application.Services
{
    public class MailService : IMailService
    {
        private readonly MailOptions _mailOptions;
        private readonly IUserRepository _userRepository;
        public MailService(IOptions<MailOptions> options, IUserRepository userRepository)
        {
            _mailOptions = options.Value;
            _userRepository = userRepository;
        }
        public async Task<string> SendAuthMail(Guid id)
        {
            string smtpServer = "smtp.mail.ru";
            int smtpPort = 587;
            string smtpAdminname = _mailOptions.Email;
            string smtpAdminPassword = _mailOptions.Password;

            try
            {
                var user = await _userRepository.GetById(id);
                var code = GenerateCode();

                if(user.TfAuth == false)
                {
                    return "Не нужно";
                }
                using(System.Net.Mail.SmtpClient smtpClient = new System.Net.Mail.SmtpClient(smtpServer,smtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(smtpAdminname,smtpAdminPassword);
                    smtpClient.EnableSsl = true;

                    using(MailMessage mailMessage = new())
                    {
                        mailMessage.From = new MailAddress(smtpAdminname);
                        mailMessage.To.Add(user.Email);
                        mailMessage.Subject = "Код подтверждения";
                        mailMessage.Body = $"Ваш код подтверждения -> {code}";

                        //smtpClient.Send(mailMessage);
                    }
                }

                return code;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ex.Message;
            }
        }
        public async Task<string> SendCreditStatusMail(Guid userId, bool status)
        {
            string smtpServer = "smtp.mail.ru";
            int smtpPort = 587;
            string smtpAdminname = _mailOptions.Email;
            string smtpAdminPassword = _mailOptions.Password;

            try
            {
                var user = await _userRepository.GetById(userId);

                using (System.Net.Mail.SmtpClient smtpClient = new System.Net.Mail.SmtpClient(smtpServer, smtpPort))
                {
                    smtpClient.Credentials = new NetworkCredential(smtpAdminname, smtpAdminPassword);
                    smtpClient.EnableSsl = true;

                    using (MailMessage mailMessage = new())
                    {
                        mailMessage.From = new MailAddress(smtpAdminname);
                        mailMessage.To.Add(user.Email);
                        mailMessage.Subject = "Информация по кредиту";
                        mailMessage.Body = (status ? 
                            "Заявка на кредит принята, деньги переведены в раздел \"Нераспределенные\" вашего счета" 
                            :
                            "Заявка на кредит непринята, для получения подробной информации о причинах, свяжитесь с нами по номеру телефона +375 (29/44/55) 000-00-00"
                            );

                        //smtpClient.Send(mailMessage);
                    }
                }

                return "OK";
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return ex.Message;
            }
        }
        public string GenerateCode()
        {
            Random rand = new Random();

            int value = rand.Next(10000, 99999);

            return value.ToString();
        }
    }
}