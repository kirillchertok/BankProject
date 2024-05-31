import { AxiosResponse } from "axios";
import { UUID } from "crypto";
import $api from "../http/auth";
import { MailResponse } from "../models/response/MailResponse";

export default class MailService{
    static async sendMail(phoneNumber: string, password: string): Promise<AxiosResponse<MailResponse>>{
        return $api.post('/Email/SendEmail',{phoneNumber, password})
    }
}