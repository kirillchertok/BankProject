using BankProject.Application.Interfaces;
using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace BankProject.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IPasswordHashed _passwordHashed;
        private readonly IUserRepository _userRepository;
        private readonly IJwtProvider _jwtProvider;
        private readonly IBankAccountService _bankAccountService;
        public AuthService(
            IJwtProvider jwtProvider,
            IUserRepository userRepository,
            IPasswordHashed passwordHashed,
            IBankAccountService bankAccountService)
        {
            _jwtProvider = jwtProvider;
            _userRepository = userRepository;
            _passwordHashed = passwordHashed;
            _bankAccountService = bankAccountService;
        }
        public async Task<(User,string,string)> Register(
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

            var hashedPassword = _passwordHashed.Generate(password);

            try
            {
                if (await _userRepository.CheckIsExist(phoneNumber))
                {
                    throw new Exception("Пользователь с таким номеров телефона уже есть");
                }

                var user = User.Create(
                    Guid.NewGuid(),
                    name,
                    secondname,
                    phoneNumber,
                    email,
                    tfAuth,
                    role,
                    passportNumber,
                    birthdayDate,
                    passportId,
                    hashedPassword);

                var tokenR = _jwtProvider.GenerateRefreshToken(user);
                var tokenA = _jwtProvider.GenerateAccessToken(user);

                //user = User.AddToken(user, tokenR);

                await _userRepository.Add(user);

                await _userRepository.UpdateToken(user.Id, tokenR);

                return (user, tokenA, tokenR);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new User(), ex.Message, "Error");
            }
        }
        public async Task<(Guid, bool, string)> CheckUserTfAuth(string phoneNumber)
        {
            try
            {
                var user = await _userRepository.GetByPhoneNumber(phoneNumber);

                return (user.Id, user.TfAuth, "OK");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (Guid.Empty, false, ex.Message);
            }
        }
        public async Task<(User,string,string)> Login(
            string phoneNumber,
            string password)
        {
            try
            {
                var user = await _userRepository.GetByPhoneNumber(phoneNumber);

                var (bankAccount, error) = await _bankAccountService.GetAccountByUserId(user.Id);

                if(error != "OK")
                {
                    throw new Exception(error);
                }

                if (bankAccount.IsBanned)
                {
                    return (user, "Пользователь заблокирован" , "Error");
                }

                var result = _passwordHashed.Verify(password, user.Password);

                if (result == false)
                {
                    throw new Exception("Неправильный пароль");
                }

                var tokenR = _jwtProvider.GenerateRefreshToken(user);
                var tokenA = _jwtProvider.GenerateAccessToken(user);

                await _userRepository.UpdateToken(user.Id, tokenR);

                return (user, tokenA, tokenR);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return (new User(), ex.Message, "Error");
            }
        }
        public async Task<Guid> Logout(Guid id)
        {
            var Id = await _userRepository.DeleteToken(id);

            return Id;
        }
        public async Task<(User,string,string)> Refresh(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new Exception("Пользователь не авторизирован");
            }

            bool validateRToken = _jwtProvider.ValidateToken(token);
            var tokenFromDb = await _userRepository.FindToken(token);

            if(!validateRToken || tokenFromDb == null)
            {
                throw new Exception("Пользователь не авторизирован");
            }

            var tokenR = _jwtProvider.GenerateRefreshToken(tokenFromDb);
            var tokenA = _jwtProvider.GenerateAccessToken(tokenFromDb);

            await _userRepository.UpdateToken(tokenFromDb.Id, tokenR);

            return (tokenFromDb, tokenA, tokenR);
        }
    }
}
