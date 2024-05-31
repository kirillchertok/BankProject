namespace BankProject.API.Contracts.Admin.ApproveCredit
{
    public record ApproveCreditRequest(
        Guid messageId,
        Guid creditId,
        Guid userId
        );
}
