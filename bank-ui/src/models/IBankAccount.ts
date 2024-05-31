import { UUID } from "crypto";

export interface IBankAccount{
    BankAccountId: UUID;
    IsBannned: boolean;
    UserId: UUID;
}