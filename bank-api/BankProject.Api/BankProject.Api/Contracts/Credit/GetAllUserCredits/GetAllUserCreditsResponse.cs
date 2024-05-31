namespace BankProject.API.Contracts.Credit.GetAllUserCredits
{
    public record GetAllUserCreditsResponse(
        List<BillsCreditModel> billsCredits
        );
}
