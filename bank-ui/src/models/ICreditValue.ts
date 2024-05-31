import { UUID } from "crypto";

export interface ICreditValue{
    creditValueId: UUID;
    currency: string;
    month: number;
    moneyValue: number;
}