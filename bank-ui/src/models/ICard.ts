import { UUID } from "crypto";

export interface ICard{
    CardId: UUID;
    AmountOfMoney: Number;
    CardNumber: string;
    PinCode: string;
    CVV: string;
    Color: string;
    EndDate: string;
    UserName: string;
    BillId: UUID;
}