namespace BankProject.API.Contracts.Credit.GetAllUserCredits
{
    public record BillsCreditModel(
        Core.Models.Bill bill,
        List<Core.Models.Credit> credits
        );
}
