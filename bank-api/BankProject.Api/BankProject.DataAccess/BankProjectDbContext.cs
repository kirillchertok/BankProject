using BankProject.DataAccess.Configurations;
using BankProject.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankProject.DataAccess
{
    public class BankProjectDbContext : DbContext
    {
        public BankProjectDbContext(DbContextOptions<BankProjectDbContext> options)
            :base(options) { }

        public DbSet<UserEntity> Users { get; set; }
        public DbSet<BankAccountEntity> BankAccounts { get; set; }
        public DbSet<BillEntity> Bills { get; set; }
        public DbSet<CardEntity> Cards { get; set; }
        public DbSet<TransactionEntity> Transactions { get; set; }
        public DbSet<CreditEntity> Credits { get; set; }
        public DbSet<AdminMessageEntity> AdminMessages { get; set; }
        public DbSet<CreditValueEntity> CreditValues { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new BankAccountConfiguration());
            modelBuilder.ApplyConfiguration(new BillConfiguration());
            modelBuilder.ApplyConfiguration(new CardConfiguration());
            modelBuilder.ApplyConfiguration(new TransactionConfiguration());
            modelBuilder.ApplyConfiguration(new CreditConfiguration());
            modelBuilder.ApplyConfiguration(new AdminMessageConfiguration());
            modelBuilder.ApplyConfiguration(new CreditValueConfiguration());

            base.OnModelCreating(modelBuilder);
        }
    }
}
