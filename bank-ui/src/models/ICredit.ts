import { UUID } from "crypto";

export interface ICredit{
    creditId: UUID;
    dateStart: string;
    monthToPay: Number;
    amountOfMoney: Number;
    procents: Number;
    leftToPay: Number;
    leftToPayThisMonth: Number;
    billId: UUID;
    endorsement: boolean;
}