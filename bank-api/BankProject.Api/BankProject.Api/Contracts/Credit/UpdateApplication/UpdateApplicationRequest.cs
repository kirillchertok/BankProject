namespace BankProject.API.Contracts.Credit.UpdateApplication
{
    public record UpdateApplicationRequest(
        Guid creditId,
        string dateStart,
        int monthToPay,
        decimal amountOfMoney,
        int procents
        );
}
