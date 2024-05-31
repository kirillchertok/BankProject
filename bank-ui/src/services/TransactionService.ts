import { UUID } from "crypto";
import $api from "../http/auth";
import { AxiosResponse } from "axios";
import { GetLastFiveTransactionsResponse } from "../models/response/GetLastFiveResponse";
import { ITransaction } from "../models/ITransaction";
import { AddTransactionsResponse } from "../models/response/AddTransactionResponse";
import { GetMonthTransactionInf } from "../models/response/GetMonthTransactionInf"

export default class TransactionsService{
    static async getLastFive(billId: UUID): Promise<AxiosResponse<GetLastFiveTransactionsResponse>> {
        return $api.post<GetLastFiveTransactionsResponse>('/Transaction/GetLastFive', {billId})
    }

    static async addBillBill(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number) : Promise<AxiosResponse<AddTransactionsResponse>>{
        return $api.post('/Transaction/AddBillBill', {bankAccountId, date, senderInf, receiverInf, amountOfMoney})
    }

    static async addBillCard(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number) : Promise<AxiosResponse<AddTransactionsResponse>>{
        return $api.post('/Transaction/AddBillCard', {bankAccountId, date, senderInf, receiverInf, amountOfMoney})
    }

    static async addCardBill(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number) : Promise<AxiosResponse<AddTransactionsResponse>>{
        return $api.post('/Transaction/AddCardBill', {bankAccountId, date, senderInf, receiverInf, amountOfMoney})
    }

    static async addCardCard(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number) : Promise<AxiosResponse<AddTransactionsResponse>>{
        return $api.post('/Transaction/AddCardCard', {bankAccountId, date, senderInf, receiverInf, amountOfMoney})
    }

    static async getAllAccountTransactions(bankAccountId: string) : Promise<AxiosResponse<ITransaction[]>>{
        return $api.get(`/Transaction/GetAllAccountTransactions?accountId=${bankAccountId}`)
    }

    static async getLastMonthInf(accountId: string) : Promise<AxiosResponse<GetMonthTransactionInf>>{
        return $api.get(`/Transaction/GetLastMonth?accountId=${accountId}`)
    }
}