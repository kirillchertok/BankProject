import { UUID } from "crypto";

export interface ITransactionAdmin{
    transactionId: UUID,
    transactionIdAdmin: UUID,
    date: string,
    senderBillId: UUID,
    senderBillNumber: string,
    senderCard: string,
    receiverBillId: UUID,
    receiverBillNumber: string,
    receiverCard: string,
    amountOfMoney: number,
    billId: UUID
}