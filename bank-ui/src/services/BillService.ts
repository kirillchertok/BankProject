import { UUID } from "crypto";
import $api from "../http/auth";
/* import { GetUserBillsResponse } from "../models/response/GetUserBillsResponse"; */
import { AddBillResponse } from "../models/response/AddBillResponse";
import { IBill } from "../models/IBill";
import { AxiosResponse } from "axios";

export default class BillService{
    static async getAllBills(bankAccountId: UUID){
        return $api.post<IBill[]>('/Bill/GetBills', {bankAccountId})
    }

    static async addBill(bankAccountId: UUID, currency: string, role: string, purpose: string){
        return $api.post<AddBillResponse>('/Bill/AddBill', {bankAccountId, currency, role, purpose})
    }

    static async distributeMoney(billid: UUID, amountOfMoney: Number, cardNumber: string) : Promise<AxiosResponse>{
        return $api.post('/Bill/DistributeMoney', {billid, amountOfMoney, cardNumber})
    }
}