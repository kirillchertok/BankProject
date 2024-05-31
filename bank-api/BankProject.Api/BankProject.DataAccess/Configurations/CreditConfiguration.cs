using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class CreditConfiguration : IEntityTypeConfiguration<CreditEntity>
    {
        public void Configure(EntityTypeBuilder<CreditEntity> builder)
        {
            builder
                .HasKey(c => c.CreditId);

            builder
                .Property(c => c.DateStart)
                .IsRequired();

            builder
                .Property(c => c.Endorsement)
                .IsRequired()
                .HasDefaultValue(false);

            builder
                .Property(c => c.MonthToPay)
                .IsRequired();

            builder
                .Property(c => c.AmountOfMoney)
                .IsRequired();

            builder
                .Property(c => c.Procents)
                .IsRequired();

            builder
                .Property(c => c.LeftToPay)
                .IsRequired();

            builder
                .Property(c => c.LeftToPayThisMonth)
                .IsRequired();

            builder
                .HasOne(c => c.Bill)
                .WithMany(b => b.Credits)
                .HasForeignKey(c => c.BillId);
        }
    }
}