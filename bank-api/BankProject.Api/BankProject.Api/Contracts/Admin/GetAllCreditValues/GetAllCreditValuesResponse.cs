namespace BankProject.API.Contracts.Admin.GetAllCreditValues
{
    public record GetAllCreditValuesResponse(
        List<Core.Models.CreditValue> creditValues
        );
}
