using BankProject.Api.Extensions;
using BankProject.Application.Infrastructure;
using BankProject.Application.Infrastructure.Jwt;
using BankProject.Application.Interfaces;
using BankProject.Application.Services;
using BankProject.Application.Services.AccountServices;
using BankProject.Core.Abstractions.DBAbstractions;
using BankProject.Core.Abstractions.ServiceAbstractions;
using BankProject.DataAccess;
using BankProject.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(nameof(JwtOptions)));
builder.Services.Configure<MailOptions>(builder.Configuration.GetSection(nameof(MailOptions)));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});

builder.Services.AddApiAuthentication(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<BankProjectDbContext>(
    options =>
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString(nameof(BankProjectDbContext)));
    });

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMailService, MailService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBankAccount, BankAccountRepository>();
builder.Services.AddScoped<IBills, BillsRepository>();
builder.Services.AddScoped<ICards, CardsRepository>();
builder.Services.AddScoped<ICredits, CreditsRepository>();
builder.Services.AddScoped<ITransactions, TransactionsRepository>();
builder.Services.AddScoped<IAdminMessage, AdminMessageRepository>();
builder.Services.AddScoped<ICreditValue, CreditValueRepository>();

builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHashed,PasswordHasher>();

builder.Services.AddScoped<IBankAccountService, BankAccountService>();
builder.Services.AddScoped<IBillService, BillService>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<ICreditService, CreditService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IAdminMessageService, AdminMessageService>();
builder.Services.AddScoped<ICreditValueService, CreditValueService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(MyAllowSpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
