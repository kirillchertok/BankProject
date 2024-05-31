namespace BankProject.API.Contracts.Account
{
    public record TrsBillsData(
        Core.Models.Bill bill,
        List<Core.Models.TransactionUser> transactions
        );
}
