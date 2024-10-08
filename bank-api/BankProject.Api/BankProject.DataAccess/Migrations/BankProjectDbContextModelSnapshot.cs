﻿// <auto-generated />
using System;
using System.Collections.Generic;
using BankProject.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BankProject.DataAccess.Migrations
{
    [DbContext(typeof(BankProjectDbContext))]
    partial class BankProjectDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("BankProject.DataAccess.Entities.AdminMessageEntity", b =>
                {
                    b.Property<Guid>("MessageId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<List<string>>("ConnectedId")
                        .IsRequired()
                        .HasColumnType("text[]");

                    b.Property<string>("DateCreate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("IsDone")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("MessageTitle")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("MessageId");

                    b.ToTable("AdminMessages");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BankAccountEntity", b =>
                {
                    b.Property<Guid>("BankAccountId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<bool>("IsBanned")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<Guid>("UserId")
                        .HasColumnType("uuid");

                    b.HasKey("BankAccountId");

                    b.HasIndex("UserId")
                        .IsUnique();

                    b.ToTable("BankAccounts");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BillEntity", b =>
                {
                    b.Property<Guid>("BillId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("AmountOfMoney")
                        .HasColumnType("numeric");

                    b.Property<decimal>("AmountOfMoneyUnAllocated")
                        .HasColumnType("numeric");

                    b.Property<Guid>("BankAccountId")
                        .HasColumnType("uuid");

                    b.Property<string>("BillNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasMaxLength(3)
                        .HasColumnType("character varying(3)");

                    b.HasKey("BillId");

                    b.HasIndex("BankAccountId");

                    b.ToTable("Bills");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.CardEntity", b =>
                {
                    b.Property<Guid>("CardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("AmountOfMoney")
                        .HasColumnType("numeric");

                    b.Property<Guid>("BillId")
                        .HasColumnType("uuid");

                    b.Property<string>("CVV")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("CardNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("EndDate")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PinCode")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("CardId");

                    b.HasIndex("BillId");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.CreditEntity", b =>
                {
                    b.Property<Guid>("CreditId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("AmountOfMoney")
                        .HasColumnType("numeric");

                    b.Property<Guid>("BillId")
                        .HasColumnType("uuid");

                    b.Property<string>("DateStart")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("Endorsement")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.Property<decimal>("LeftToPay")
                        .HasColumnType("numeric");

                    b.Property<decimal>("LeftToPayThisMonth")
                        .HasColumnType("numeric");

                    b.Property<int>("MonthToPay")
                        .HasColumnType("integer");

                    b.Property<int>("Procents")
                        .HasColumnType("integer");

                    b.HasKey("CreditId");

                    b.HasIndex("BillId");

                    b.ToTable("Credits");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.CreditValueEntity", b =>
                {
                    b.Property<Guid>("CreditValueId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("Currency")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<decimal>("MoneyValue")
                        .HasColumnType("numeric");

                    b.Property<int>("Month")
                        .HasColumnType("integer");

                    b.HasKey("CreditValueId");

                    b.ToTable("CreditValues");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.TransactionEntity", b =>
                {
                    b.Property<Guid>("TransactionId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<decimal>("AmountOfMoney")
                        .HasColumnType("numeric");

                    b.Property<Guid>("BillId")
                        .HasColumnType("uuid");

                    b.Property<string>("Date")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<Guid>("ReceiverBillId")
                        .HasColumnType("uuid");

                    b.Property<string>("ReceiverBillNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ReceiverCard")
                        .HasColumnType("text");

                    b.Property<Guid>("SenderBillId")
                        .HasColumnType("uuid");

                    b.Property<string>("SenderBillNumber")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SenderCard")
                        .HasColumnType("text");

                    b.Property<Guid>("TransactionIdAdmin")
                        .HasColumnType("uuid");

                    b.HasKey("TransactionId");

                    b.HasIndex("BillId");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.UserEntity", b =>
                {
                    b.Property<Guid>("UserId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<Guid?>("BankAccountId")
                        .HasColumnType("uuid");

                    b.Property<string>("BirthdayDate")
                        .IsRequired()
                        .HasMaxLength(10)
                        .HasColumnType("character varying(10)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PassportId")
                        .IsRequired()
                        .HasMaxLength(14)
                        .HasColumnType("character varying(14)");

                    b.Property<string>("PassportNumber")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("character varying(9)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("PhoneNumber")
                        .IsRequired()
                        .HasMaxLength(14)
                        .HasColumnType("character varying(14)");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Role")
                        .IsRequired()
                        .ValueGeneratedOnAdd()
                        .HasColumnType("text")
                        .HasDefaultValue("user");

                    b.Property<string>("SecondName")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<bool>("TfAuth")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("boolean")
                        .HasDefaultValue(false);

                    b.HasKey("UserId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BankAccountEntity", b =>
                {
                    b.HasOne("BankProject.DataAccess.Entities.UserEntity", "User")
                        .WithOne("BankAccount")
                        .HasForeignKey("BankProject.DataAccess.Entities.BankAccountEntity", "UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BillEntity", b =>
                {
                    b.HasOne("BankProject.DataAccess.Entities.BankAccountEntity", "BankAccount")
                        .WithMany("Bills")
                        .HasForeignKey("BankAccountId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("BankAccount");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.CardEntity", b =>
                {
                    b.HasOne("BankProject.DataAccess.Entities.BillEntity", "Bill")
                        .WithMany("Cards")
                        .HasForeignKey("BillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bill");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.CreditEntity", b =>
                {
                    b.HasOne("BankProject.DataAccess.Entities.BillEntity", "Bill")
                        .WithMany("Credits")
                        .HasForeignKey("BillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bill");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.TransactionEntity", b =>
                {
                    b.HasOne("BankProject.DataAccess.Entities.BillEntity", "Bill")
                        .WithMany("Transactions")
                        .HasForeignKey("BillId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Bill");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BankAccountEntity", b =>
                {
                    b.Navigation("Bills");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.BillEntity", b =>
                {
                    b.Navigation("Cards");

                    b.Navigation("Credits");

                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("BankProject.DataAccess.Entities.UserEntity", b =>
                {
                    b.Navigation("BankAccount");
                });
#pragma warning restore 612, 618
        }
    }
}
