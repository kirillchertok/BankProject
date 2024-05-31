using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess.Configurations
{
    public class AdminMessageConfiguration : IEntityTypeConfiguration<AdminMessageEntity>
    {
        public void Configure(EntityTypeBuilder<AdminMessageEntity> builder)
        {
            builder
                .HasKey(m => m.MessageId);

            builder
                .Property(m => m.MessageTitle)
                .IsRequired();

            builder
                .Property(m => m.Message)
                .IsRequired();

            builder
                .Property(m => m.DateCreate)
                .IsRequired();

            builder
                .Property(m => m.ConnectedId);

            builder
                .Property(m => m.IsDone)
                .HasDefaultValue(false);
        }
    }
}
