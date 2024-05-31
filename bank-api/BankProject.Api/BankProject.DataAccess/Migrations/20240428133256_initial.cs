using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BankProject.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdminMessages",
                columns: table => new
                {
                    MessageId = table.Column<Guid>(type: "uuid", nullable: false),
                    MessageTitle = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    ConnectedId = table.Column<List<string>>(type: "text[]", nullable: false),
                    IsDone = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    DateCreate = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdminMessages", x => x.MessageId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    SecondName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    TfAuth = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    Role = table.Column<string>(type: "text", nullable: false, defaultValue: "user"),
                    PassportNumber = table.Column<string>(type: "character varying(9)", maxLength: 9, nullable: false),
                    BirthdayDate = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    PassportId = table.Column<string>(type: "character varying(14)", maxLength: 14, nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: false),
                    BankAccountId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "BankAccounts",
                columns: table => new
                {
                    BankAccountId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsBanned = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BankAccounts", x => x.BankAccountId);
                    table.ForeignKey(
                        name: "FK_BankAccounts_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bills",
                columns: table => new
                {
                    BillId = table.Column<Guid>(type: "uuid", nullable: false),
                    BillNumber = table.Column<string>(type: "text", nullable: false),
                    Currency = table.Column<string>(type: "character varying(3)", maxLength: 3, nullable: false),
                    AmountOfMoney = table.Column<decimal>(type: "numeric", nullable: false),
                    AmountOfMoneyUnAllocated = table.Column<decimal>(type: "numeric", nullable: false),
                    BankAccountId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bills", x => x.BillId);
                    table.ForeignKey(
                        name: "FK_Bills_BankAccounts_BankAccountId",
                        column: x => x.BankAccountId,
                        principalTable: "BankAccounts",
                        principalColumn: "BankAccountId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cards",
                columns: table => new
                {
                    CardId = table.Column<Guid>(type: "uuid", nullable: false),
                    AmountOfMoney = table.Column<decimal>(type: "numeric", nullable: false),
                    CardNumber = table.Column<string>(type: "text", nullable: false),
                    PinCode = table.Column<string>(type: "text", nullable: false),
                    CVV = table.Column<string>(type: "text", nullable: false),
                    Color = table.Column<string>(type: "text", nullable: false),
                    EndDate = table.Column<string>(type: "text", nullable: false),
                    UserName = table.Column<string>(type: "text", nullable: false),
                    BillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cards", x => x.CardId);
                    table.ForeignKey(
                        name: "FK_Cards_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Credits",
                columns: table => new
                {
                    CreditId = table.Column<Guid>(type: "uuid", nullable: false),
                    DateStart = table.Column<string>(type: "text", nullable: false),
                    MonthToPay = table.Column<int>(type: "integer", nullable: false),
                    AmountOfMoney = table.Column<decimal>(type: "numeric", nullable: false),
                    Procents = table.Column<int>(type: "integer", nullable: false),
                    LeftToPay = table.Column<decimal>(type: "numeric", nullable: false),
                    LeftToPayThisMonth = table.Column<decimal>(type: "numeric", nullable: false),
                    Endorsement = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    BillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Credits", x => x.CreditId);
                    table.ForeignKey(
                        name: "FK_Credits_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    TransactionId = table.Column<Guid>(type: "uuid", nullable: false),
                    TransactionIdAdmin = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<string>(type: "text", nullable: false),
                    SenderBillId = table.Column<Guid>(type: "uuid", nullable: false),
                    SenderBillNumber = table.Column<string>(type: "text", nullable: false),
                    SenderCard = table.Column<string>(type: "text", nullable: true),
                    ReceiverBillId = table.Column<Guid>(type: "uuid", nullable: false),
                    ReceiverBillNumber = table.Column<string>(type: "text", nullable: false),
                    ReceiverCard = table.Column<string>(type: "text", nullable: true),
                    AmountOfMoney = table.Column<decimal>(type: "numeric", nullable: false),
                    BillId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.TransactionId);
                    table.ForeignKey(
                        name: "FK_Transactions_Bills_BillId",
                        column: x => x.BillId,
                        principalTable: "Bills",
                        principalColumn: "BillId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BankAccounts_UserId",
                table: "BankAccounts",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Bills_BankAccountId",
                table: "Bills",
                column: "BankAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_Cards_BillId",
                table: "Cards",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_Credits_BillId",
                table: "Credits",
                column: "BillId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BillId",
                table: "Transactions",
                column: "BillId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdminMessages");

            migrationBuilder.DropTable(
                name: "Cards");

            migrationBuilder.DropTable(
                name: "Credits");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Bills");

            migrationBuilder.DropTable(
                name: "BankAccounts");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
