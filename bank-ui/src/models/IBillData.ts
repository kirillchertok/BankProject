import { IBill } from "./IBill";
import { ICard } from "./ICard";
import { ICredit } from "./ICredit";

export interface IBillData{
    bill: IBill;
    cards: ICard[];
    creditrs: ICredit[];
}