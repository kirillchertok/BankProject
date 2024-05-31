using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class BillConfiguration : IEntityTypeConfiguration<BillEntity>
    {
        public void Configure(EntityTypeBuilder<BillEntity> builder)
        {
            builder
                .HasKey(b => b.BillId);

            builder
                .Property(b => b.BillNumber)
                .IsRequired();

            builder
                .Property(b => b.Currency)
                .HasMaxLength(3)
                .IsRequired();

            builder
                .Property(b => b.AmountOfMoney);

            builder
                .Property(b => b.AmountOfMoneyUnAllocated);

            builder
                .HasOne(b => b.BankAccount)
                .WithMany(b => b.Bills)
                .HasForeignKey(b => b.BankAccountId);

            builder
                .HasMany(b => b.Cards)
                .WithOne(b => b.Bill);
            builder
                .HasMany(b => b.Transactions)
                .WithOne(b => b.Bill);
            builder
                .HasMany(b => b.Credits)
                .WithOne(b => b.Bill);
        }
    }
}