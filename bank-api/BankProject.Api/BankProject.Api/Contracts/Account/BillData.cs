namespace BankProject.API.Contracts.Account
{
    public record BillData(
        Core.Models.Bill bill,
        List<Core.Models.Card> cards,
        List<Core.Models.Credit> credits
        );
}
