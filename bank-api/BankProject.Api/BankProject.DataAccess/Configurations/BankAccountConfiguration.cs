using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class BankAccountConfiguration : IEntityTypeConfiguration<BankAccountEntity>
    {
        public void Configure(EntityTypeBuilder<BankAccountEntity> builder)
        {
            builder
                .HasKey(b => b.BankAccountId);

            builder
                .Property(b => b.IsBanned).HasDefaultValue(false);

            builder
                .HasOne(b => b.User)
                .WithOne(u => u.BankAccount)
                .HasForeignKey<BankAccountEntity>(b => b.UserId);

            builder
                .HasMany(b => b.Bills)
                .WithOne(b => b.BankAccount);
        }
    }
}
