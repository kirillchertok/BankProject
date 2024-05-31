import { UUID } from "crypto";
import $api from "../http/auth";
import { AxiosResponse } from "axios";
/* import { GetCardsResponse } from "../models/response/GetCardsResponse";
import { IBill } from "../models/IBill";
import { ITransaction } from "../models/ITransaction"; */
import { ICard } from "../models/ICard";

export default class CardService{
    static async getCards(billId: UUID) : Promise<AxiosResponse<ICard[]>>{
        return $api.post<ICard[]>('/Card/GetCards', {billId})
    }
    static async addCard(billId: UUID, paymentSystem: string, pinCode: string, CVV: string, color: string, userName: string) : Promise<AxiosResponse<string>>{
        return $api.post<string>('/Card/AddCard', {billId, paymentSystem, pinCode, CVV, color, userName})
    }
}