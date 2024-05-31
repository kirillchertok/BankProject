import { AxiosResponse } from "axios";
import { GetCreditResponse } from "../models/response/GetCreditsResponse";
import $api from "../http/auth";
import { UUID } from "crypto";
import { TryCreditResponse } from "../models/response/tryCreditResponse";
import { ICredit } from "../models/ICredit";
import { GetOneCredit } from "../models/response/GetOneCreditResponse";
import { GetAllCreditValues } from "../models/response/GetAllCreditValues"


export default class CreditService{
    static async getAllCredits(accountId: string) : Promise<AxiosResponse<GetCreditResponse>>{
        return $api.get(`/Credit/GetAllUserCredits?accountId=${accountId}`)
    }

    static async tryGetCredit(userId: UUID, billId: UUID, dateStart: string, amountOfMoney: number, monthToPay: number, salary: number, procents: number) : Promise<AxiosResponse<TryCreditResponse>> {
        return $api.post('/Credit/TryCredit', {billId, userId, dateStart, monthToPay, amountOfMoney, procents, salary})
    }

    static async updatePayment(billId: UUID, creditId: UUID, amountOfMoney: number, cardNumber: string, type: string){
        return $api.patch('/Credit/UpdatePayment', {billId, creditId, amountOfMoney, cardNumber, type})
    }

    static async getOneCreditById(creditId: UUID) : Promise<AxiosResponse<GetOneCredit>>{
        return $api.get(`/Credit/GetOneCreditById?creditId=${creditId}`)
    }

    static async updateApplicationInf(creditId: UUID, dateStart: string, amountOfMoney: number, monthToPay: number, procents: number){
        return $api.put('/Credit/UpdateCreditApplicationInf', {creditId, dateStart, monthToPay, amountOfMoney, procents})
    }

    static async GetAllCreditValues() : Promise<AxiosResponse<GetAllCreditValues>>{
        return $api.get('/Credit/GetAllCreditValuesUser')
    }
}