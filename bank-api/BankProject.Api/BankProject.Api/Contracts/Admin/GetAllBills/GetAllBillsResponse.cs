namespace BankProject.API.Contracts.Admin.GetAllBills
{
    public record GetAllBillsResponse(
        List<Core.Models.Bill> bills
        );
}
