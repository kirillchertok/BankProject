using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class CardConfiguration : IEntityTypeConfiguration<CardEntity>
    {
        public void Configure(EntityTypeBuilder<CardEntity> builder)
        {
            builder
                .HasKey(c => c.CardId);

            builder
                .Property(c => c.AmountOfMoney)
                .IsRequired();

            builder
                .Property(c => c.Color)
                .IsRequired();

            builder
                .Property(c => c.CardNumber)
                .IsRequired();

            builder
                .Property(c => c.PinCode)
                .IsRequired();

            builder
                .Property(c => c.CVV)
                .IsRequired();

            builder
                .Property(c => c.EndDate)
                .IsRequired();

            builder
                .Property(c => c.UserName)
                .IsRequired();

            builder
                .HasOne(c => c.Bill)
                .WithMany(b => b.Cards)
                .HasForeignKey(c => c.BillId);
        }
    }
}