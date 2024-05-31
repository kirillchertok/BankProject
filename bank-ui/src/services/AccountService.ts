import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import { GetAllAccountData } from "../models/response/GetAllAccountData";
import $api from "../http/auth";
import { GetFullNameResponse } from "../models/response/GetFullNameResponse";
import { GetTrsBillsData } from "../models/response/GetTrsBillsData";

export default class AccountService{
    static async getAllAccountData(bankAccountId: string) : Promise<AxiosResponse<GetAllAccountData>>{
        return $api.get<GetAllAccountData>(`/Account/getAllData?accountId=${bankAccountId}`)
    }

    static async getFullName(userId: string) : Promise<AxiosResponse<GetFullNameResponse>>{
        return $api.get<GetFullNameResponse>(`/Account/getFullName?userId=${userId}`)
    }

    static async getTrsBillsData(bankAccountId: string) : Promise<AxiosResponse<GetTrsBillsData>>{
        return $api.get<GetTrsBillsData>(`/Account/getTrsBillsData?accountId=${bankAccountId}`)
    }

    static async checkBanned(userId: string){
        return $api.get(`/Account/CheckBan?userId=${userId}`)
    }

    static async SendUnbanMessage(userId: string){
        return $api.post(`/Auth/AddUnbanMessage?userId=${userId}`)
    }
}