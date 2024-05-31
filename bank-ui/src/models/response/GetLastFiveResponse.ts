import { ITransaction } from "../ITransaction";

export interface GetLastFiveTransactionsResponse{
    transactions: ITransaction[];
}