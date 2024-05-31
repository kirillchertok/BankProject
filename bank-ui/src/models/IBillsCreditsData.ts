import { IBill } from "./IBill";
import { ICredit } from "./ICredit";

export interface IBillsCreditsData{
    bill: IBill;
    credits: ICredit[];
}