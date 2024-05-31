import { AxiosResponse } from "axios";
import $api from "../http/auth";
import { AuthResponse } from "../models/response/AuthResponse";
import { UUID } from "crypto";

export default class AuthService{
    static async login(phoneNumber: string, password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/Auth/Login',{phoneNumber ,password})
    }

    static async registration(
        name: string, 
        secondname: string, 
        phoneNumber: string, 
        email: string, 
        tfAuth: boolean, 
        role: string,
        passportNumber: string,
        birthdayDate: string,
        passportId: string,  
        password: string
        ): Promise<AxiosResponse<AuthResponse>>{
        return $api.post<AuthResponse>('/Auth/Register',{
            name, 
            secondname, 
            phoneNumber, 
            email, 
            tfAuth, 
            role,
            passportNumber,
            birthdayDate,
            passportId,  
            password})
    }
    
    static async logout(id: UUID): Promise<AxiosResponse<UUID>>{
        return $api.post<UUID>('/Auth/Logout',{id})
    }
}