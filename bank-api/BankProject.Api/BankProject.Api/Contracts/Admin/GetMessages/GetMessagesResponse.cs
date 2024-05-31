namespace BankProject.API.Contracts.Admin.GetMessages
{
    public record GetMessagesResponse(
        List<Core.Models.AdminMessage> adminMessages
        );
}
