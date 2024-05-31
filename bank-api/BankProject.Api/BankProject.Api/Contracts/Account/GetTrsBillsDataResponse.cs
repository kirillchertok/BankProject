namespace BankProject.API.Contracts.Account
{
    public record GetTrsBillsDataResponse(
        List<TrsBillsData> billsData
        );
}
