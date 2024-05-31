using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BankProject.DataAccess.Configurations
{
    public class CreditValueConfiguration : IEntityTypeConfiguration<CreditValueEntity>
    {
        public void Configure(EntityTypeBuilder<CreditValueEntity> builder)
        {
            builder
                .HasKey(cv => cv.CreditValueId);

            builder
                .Property(m => m.Currency)
                .IsRequired();

            builder
                .Property(m => m.Month)
                .IsRequired();

            builder
                .Property(m => m.MoneyValue)
                .IsRequired();
        }
    }
}
