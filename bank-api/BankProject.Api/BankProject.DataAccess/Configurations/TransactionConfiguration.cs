using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class TransactionConfiguration : IEntityTypeConfiguration<TransactionEntity>
    {
        public void Configure(EntityTypeBuilder<TransactionEntity> builder)
        {
            builder
                .HasKey(t => t.TransactionId);

            builder
                .Property(t => t.TransactionIdAdmin)
                .IsRequired();

            builder
                .Property(t => t.Date)
                .IsRequired();

            builder
                .Property(t => t.SenderBillId)
                .IsRequired();

            builder
                .Property(t => t.SenderBillNumber)
                .IsRequired();

            builder
                .Property(t => t.SenderCard);

            builder
                .Property(t => t.ReceiverBillId)
                .IsRequired();

            builder
                .Property(t => t.ReceiverBillNumber)
                .IsRequired();

            builder
                .Property(t => t.ReceiverCard);

            builder
                .Property(t => t.AmountOfMoney)
                .IsRequired();

            builder
                .HasOne(t => t.Bill)
                .WithMany(b => b.Transactions)
                .HasForeignKey(t => t.BillId);
        }
    }
}