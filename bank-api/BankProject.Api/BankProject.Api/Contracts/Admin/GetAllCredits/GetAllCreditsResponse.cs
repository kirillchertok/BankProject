namespace BankProject.API.Contracts.Admin.GetAllCredits
{
    public record GetAllCreditsResponse(
        List<Core.Models.Credit> credits
        );
}
