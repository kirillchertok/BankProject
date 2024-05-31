using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace BankProject.DataAccess.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<UserEntity>
    {
        public void Configure(EntityTypeBuilder<UserEntity> builder)
        {
            builder
                .HasKey(x => x.UserId);

            builder
                .Property(x => x.Name)
                .IsRequired();

            builder
                .Property(x => x.SecondName)
                .IsRequired();

            builder
                .Property(x => x.PhoneNumber)
                .HasMaxLength(14)
                .IsRequired();

            builder
                .Property(x => x.Email)
                .IsRequired();

            builder
                .Property(x => x.TfAuth)
                .HasDefaultValue(false);

            builder
                .Property(x => x.Role)
                .HasDefaultValue("user")
                .IsRequired();

            builder
                .Property(x => x.PassportNumber)
                .HasMaxLength(9)
                .IsRequired();

            builder
                .Property(x => x.BirthdayDate)
                .HasMaxLength(10)
                .IsRequired();

            builder
                .Property(x => x.PassportId)
                .HasMaxLength(14)
                .IsRequired();

            builder
                .Property(x => x.Password)
                .IsRequired();

            builder
                .Property(x => x.RefreshToken);

            builder
                .Property(x => x.BankAccountId);

            builder
                .HasOne(u => u.BankAccount)
                .WithOne(b => b.User)
                .HasForeignKey<UserEntity>(b => b.BankAccountId);

        }
    }
}
