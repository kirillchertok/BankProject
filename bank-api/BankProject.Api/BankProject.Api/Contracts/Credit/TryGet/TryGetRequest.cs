namespace BankProject.API.Contracts.Credit.TryGet
{
    public record TryGetRequest(
        Guid billId, 
        Guid userId, 
        string dateStart, 
        int monthToPay, 
        decimal amountOfMoney, 
        int procents, 
        decimal salary
        );
}
