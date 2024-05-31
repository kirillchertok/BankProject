import { IBill } from "./IBill";
import { ITransaction } from "./ITransaction";

export interface IBillsTransactionsData{
    bill: IBill;
    transactions: ITransaction[];
}