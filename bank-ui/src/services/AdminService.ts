import { AxiosResponse } from "axios";
import $api from "../http/auth";
import { IUser } from "../models/IUser";
import { IBankAccount } from "../models/IBankAccount";
import { UUID } from "crypto";
import { BanUnBanUserResponse } from "../models/response/BanUnBanResponse";
import { GetAllAdminMessages } from "../models/response/GetAllAdminMessagesResponse"
import { GetAllCreditsResponse } from '../models/response/GetAllCreditsResponse'
import { GetAllTransactionsAdminRespose } from '../models/response/GetAllTransactionAdminResponse'
import { GetAllCardsResponse } from '../models/response/GetAllCardResponse'
import { GetAllBillsResponse } from '../models/response/GetAllBillsResponse'
import { GetAllTransactionsResponse } from "../models/response/GetAllTransactionsResponse";

export default class AdminService{
    static async getAllUsers() : Promise<AxiosResponse<IUser[]>>{
        return $api.get<IUser[]>('/Admin/allusers')
    }
    static async getAllAccounts() : Promise<AxiosResponse<IBankAccount[]>>{
        return $api.get<IBankAccount[]>('/Admin/allaccounts')
    }
    static async GetOneUser(userId: UUID) : Promise<AxiosResponse<IUser>>{
        return $api.post<IUser>('/Admin/oneuser', {userId})
    }
    static async GetOneAccount(userId: UUID) : Promise<AxiosResponse<IBankAccount>>{
        return $api.post<IBankAccount>('/Admin/oneaccount', {userId})
    }
    static async BanUserByUserId(userId: UUID) : Promise<AxiosResponse<BanUnBanUserResponse>>{
        return $api.post<BanUnBanUserResponse>('/Admin/banUser', {userId})
    }
    static async UnBanUserByUserId(userId: UUID) : Promise<AxiosResponse<BanUnBanUserResponse>>{
        return $api.post<BanUnBanUserResponse>('/Admin/unBanUser', {userId})
    }
    static async GetAllMessages() : Promise<AxiosResponse<GetAllAdminMessages>>{
        return $api.get<GetAllAdminMessages>('/Admin/GetMessages')
    }
    static async ApproveCredit(userId: UUID, messageId: UUID, creditId: UUID){
        return $api.patch('/Admin/ApproveCredit', {userId, messageId, creditId})
    }
    static async RejectCredit(userId: UUID, messageId: UUID, creditId: UUID){
        return $api.patch('/Admin/RejectCredit', {userId, messageId, creditId})
    }
    static async GetAllCredits() : Promise<AxiosResponse<GetAllCreditsResponse>>{
        return $api.get('/Admin/GetAllCredits')
    }
    static async GetAllTransactions() : Promise<AxiosResponse<GetAllTransactionsAdminRespose>>{
        return $api.get('/Admin/GetAllTransactions')
    }
    static async GetAllCards() : Promise<AxiosResponse<GetAllCardsResponse>>{
        return $api.get('/Admin/GetAllCards')
    }
    static async GetAllBills() : Promise<AxiosResponse<GetAllBillsResponse>>{
        return $api.get('/Admin/GetAllBills')
    }
    static AddMoney(billId: UUID, amountofMoney: number){
        return $api.patch('/Admin/AddMoney', {billId, amountofMoney})
    }
    static AddMoneyUnAllocated(billId: UUID, amountofMoney: number){
        return $api.patch('/Admin/AddMoneyUnAllocated', {billId, amountofMoney})
    }
    static RemoveMoney(billId: UUID, amountofMoney: number){
        return $api.patch('/Admin/RemoveMoney', {billId, amountofMoney})
    }
    static RemoveMoneyUnAllocated(billId: UUID, amountofMoney: number){
        return $api.patch('/Admin/RemoveMoneyUnAllocated', {billId, amountofMoney})
    }
    static UpdateCreditValue(currency: string, month: number, amountOfMoney: number){
        return $api.put('/Admin/UpdateCreditValue', {currency, month, amountOfMoney})
    }
}