import { UUID } from "crypto";

export interface IBill{
    amountOfMoney: Number;
    amountOfMoneyUnAllocated: Number;
    bankAccountId: UUID;
    billId: UUID;
    billNumber: string;
    currency: string;
}