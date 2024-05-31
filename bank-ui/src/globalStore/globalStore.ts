import { UUID } from "crypto";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http/auth";
import MailService from "../services/MailService";
import BillService from "../services/BillService";
import { IBill } from "../models/IBill";
import { ITransaction } from "../models/ITransaction";
import TransactionsService from "../services/TransactionService";
import CardService from "../services/CardService";
import { ICard } from "../models/ICard";
import AdminService from "../services/AdminService";
import AccountService from "../services/AccountService";
import { IBillData } from "../models/IBillData";
import CreditService from "../services/CrediteService";

interface currency{
    name: string;
    img: string;
    alt: string;
}
interface role{
    role: string;
}
interface purpose{
    purpose: string
}

export default class GlobalStore{
    isFetching = false;

    id: UUID;
    role: string = "";
    bankAccountId: UUID;
    bills: IBill[] = [];
    trs: Array<Array<ITransaction>>;
    cards: ICard[] = [];

    dropDownSelectedCurrency: currency;
    dropDownSelectedRole: role;
    dropDownSelectedPurpose: purpose;
    dropDownSelectedCard: string;

    isOpenAddBill = false;
    isOpenDistributeMoney = false;
    isOpenLogin = false;
    isOpenUserBanned = false;
    isOpenAddCredit = false;
    isOpenAddPaymentToCredit = false;

    isAuth = false;
    wasOperationBefore = false;

    errorAuth = "";
    errorTransaction = "";
    errorCredit = "";
    errorCreditPayment = "";
    errorSendUnbanMessage = "";

    code = "";
    billToDistribute: IBillData;
    changeCurrentBillNumber: string;

    constructor(){
        makeAutoObservable(this)
    }
    
    setIsOpenLogin(bool: boolean){
        this.isOpenLogin = bool
    }
    
    setAuth(bool: boolean){
        this.isAuth = bool
    }

    setId(id: UUID){
        this.id = id
    }
    
    setBankAccountId(id: UUID){
        this.bankAccountId = id
    }

    setErrorAuth(error: string){
        this.errorAuth = error
    }

    setCode(code: string){
        this.code = code
    }

    setBills(bills: IBill[]){
        this.bills = bills
    }

    setRole(role: string){
        this.role = role
    }

    setTrs(trs: Array<Array<ITransaction>>){
        this.trs = trs
    }

    setErrorTransaction(error: string){
        this.errorTransaction = error;
    }

    setCards(cards: ICard[]){
        this.cards = cards;
    }

    setIsOpenDistributeMoney(state: boolean){
        this.isOpenDistributeMoney = state
    }

    setBillToDistribute(billData: IBillData){
        this.billToDistribute = billData
    }

    setIsOpenAddBill(state: boolean){
        this.isOpenAddBill = state
    }

    setDropDownSelectedCurrency(currency: currency){
        this.dropDownSelectedCurrency = currency
    }

    setDropDownSelectedRole(role: role){
        this.dropDownSelectedRole = role
    }

    setDropDownSelectedPurpose(purpose: purpose){
        this.dropDownSelectedPurpose = purpose
    }

    setDropDownSelectedCard(card: string){
        this.dropDownSelectedCard = card
    }

    setWasOperationBefore(state: boolean){
        this.wasOperationBefore = state
    }

    setIsOpenUserBanned(state: boolean){
        this.isOpenUserBanned = state
    }

    setIsOpenAddCredit(state: boolean){
        this.isOpenAddCredit = state
    }

    setIsOpenAddPaymentCredit(state: boolean){
        this.isOpenAddPaymentToCredit = state
    }

    setErrorCredit(error: string){
        this.errorCredit = error
    }

    setErrorCreditPayment(error: string){
        this.errorCreditPayment = error
    }

    setErrorSendUnbanMessage(error: string){
        this.errorSendUnbanMessage = error
    }

    setChangeCurrentBill(value: string){
        this.changeCurrentBillNumber = value;
    }

    setIsFetching(state: boolean){
        this.isFetching = state
    }

    async login(phoneNumber: string, password: string){
        try{
            this.setIsFetching(true)
            const response = await AuthService.login(phoneNumber, password)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            localStorage.setItem('token', response.data.tokenA);
            localStorage.setItem('role', response.data.role);
            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('accountId', response.data.bankAccountId)
            this.setAuth(true);
            this.setRole(response.data.role);
            this.setId(response.data.id);
            this.setBankAccountId(response.data.bankAccountId)

            return response.data.id
        }catch (e){
            console.log(e.response?.data);
            this.setErrorAuth(e.response.data)
        }
    }

    async registration(
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
        ){
        try{
            this.setIsFetching(true)

            const response = await AuthService.registration(
                name, 
                secondname, 
                phoneNumber, 
                email, 
                tfAuth, 
                role,
                passportNumber,
                birthdayDate,
                passportId,  
                password);

            if(response !== undefined){
                this.setIsFetching(false)
            }
            localStorage.setItem('token', response.data.tokenA);
            localStorage.setItem('role', response.data.role);
            this.setAuth(true);
            this.setRole(response.data.role);
            this.setId(response.data.id);
            this.setBankAccountId(response.data.bankAccountId)
        }catch (e){
            console.log(e.response?.data)
            this.setErrorAuth(e.response.data)
        }
    }

    async logout(id: UUID){
        try{
            const response = await AuthService.logout(id);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('accountId');
            localStorage.removeItem('currentBill');
            localStorage.removeItem('role');
            localStorage.removeItem('billsNumbers');
            this.setAuth(false);
            this.setId({} as UUID);
        }catch (e){
            console.log(e.response?.data)
            this.setErrorAuth(e.response.data)
        }
    }

    async checkAuth(){
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/Auth/Refresh`,{
                withCredentials: true
            })
            localStorage.setItem('token', response.data.tokenA);
            localStorage.setItem('role', response.data.role);
            this.setAuth(true);
            this.setRole(response.data.role);
            this.setId(response.data.id);
            this.setBankAccountId(response.data.bankAccountId)
        }catch (e){
            console.log(e.response?.data)
            this.setErrorAuth(e.response.data)
        }
    }

    async sendEmail(phoneNumner: string, password: string){
        try{
            this.setIsFetching(true)

            localStorage.setItem('phoneNumber', phoneNumner)
            localStorage.setItem('password', password);

            const response = await MailService.sendMail(phoneNumner, password)

            if(response !== undefined){
                this.setIsFetching(false)
            }

            const code = response.data.code

            if(response.data.code === "ErrorBan"){
                localStorage.setItem('userId', response.data.id);
                this.setIsOpenLogin(false)
                this.setIsOpenUserBanned(true)
                this.setErrorAuth("")
                return;
            }

            this.setCode(code)
        }catch (e){
            console.log(e.response?.data)
            this.setErrorAuth(e.response.data)
            this.setIsFetching(false)
        }
    }

    async getBills(bankAccountId: UUID){
        try{
            this.setIsFetching(true)
            const response = await BillService.getAllBills(bankAccountId);
            if(response !== undefined){
                this.setIsFetching(false)
            }
            this.setBills(response.data);
            return response.data;
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async addBill(bankAccountId: UUID, currency: string, role: string, purpose: string){
        try{
            this.setIsFetching(true)
            const response = await BillService.addBill(bankAccountId, currency, role, purpose);
            if(response !== undefined){
                this.setIsFetching(false)
            }
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getLastFive(billId: UUID){
        try{
            this.setIsFetching(true)
            const response = await TransactionsService.getLastFive(billId);
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response;
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async addTransactionBillBill(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number){
        try{
            this.setIsFetching(true)
            const response =  await TransactionsService.addBillBill(bankAccountId, date, senderInf, receiverInf, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
                this.setErrorTransaction("Транзакция прошла успешно")
            }
            return response;
        }   
        catch (e){
            console.log(e.response?.data)
            this.setErrorTransaction(e.response.data)
        }
    }
    
    async addTransactionBillCard(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number){
        try{
            this.setIsFetching(true)
            const response =  await TransactionsService.addBillCard(bankAccountId, date, senderInf, receiverInf, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
                this.setErrorTransaction("Транзакция прошла успешно")
            }
            return response;
        }   
        catch (e){
            console.log(e.response?.data)
            this.setErrorTransaction(e.response.data)
        }
    }

    async addTransactionCardBill(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number){
        try{
            this.setIsFetching(true)
            const response =  await TransactionsService.addCardBill(bankAccountId, date, senderInf, receiverInf, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
                this.setErrorTransaction("Транзакция прошла успешно")
            }
            return response;
        }   
        catch (e){
            console.log(e.response?.data)
            this.setErrorTransaction(e.response.data)
        }
    }

    async addTransactionCardCard(bankAccountId: UUID, date: string, senderInf: string, receiverInf: string, amountOfMoney: Number){
        try{
            this.setIsFetching(true)
            const response =  await TransactionsService.addCardCard(bankAccountId, date, senderInf, receiverInf, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
                this.setErrorTransaction("Транзакция прошла успешно")
            }
            return response;
        }   
        catch (e){
            console.log(e.response?.data)
            this.setErrorTransaction(e.response.data)
        }
    }

    async getCards(billId: UUID){
        try{
            this.setIsFetching(true)
            const response = await CardService.getCards(billId);
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data;
        }
        catch (e){
            console.log(e.respons?.data)
        }
    }

    async AddCard(billId: UUID, paymentSystem: string, pinCode: string, CVV: string, color: string, userName: string){
        try{
            this.setIsFetching(true)
            const response = await CardService.addCard(billId, paymentSystem, pinCode, CVV, color, userName)
            if(response !== undefined){
                this.setIsFetching(false)
            }
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getAllUsers(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.getAllUsers();
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getAllAccounts(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.getAllAccounts()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data;
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getOneUser(userId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetOneUser(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getOneAccount(userId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetOneAccount(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async BanUserByUserId(userId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.BanUserByUserId(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async UnBanUserByUserId(userId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.UnBanUserByUserId(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetAllAccountData(bankAccountId: string){
        try{
            this.setIsFetching(true)
            const response = await AccountService.getAllAccountData(bankAccountId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetFullUserName(userId: string){
        try{
            this.setIsFetching(true)
            const response = await AccountService.getFullName(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async DistributeMoney(billId: UUID, amountOfMoney: Number, cardNumber: string){
        try{
            this.setIsFetching(true)
            const response = await BillService.distributeMoney(billId, amountOfMoney, cardNumber)
            if(response !== undefined){
                this.setIsFetching(false)
            }
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetTrsBillsData(accountId: string){
        try{
            this.setIsFetching(true)
            const response = await AccountService.getTrsBillsData(accountId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getAllAccountTransactions(bankAccountId: string){
        try{
            this.setIsFetching(true)
            const response = await TransactionsService.getAllAccountTransactions(bankAccountId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async getAllAccountCredits(bankAccountId: string){
        try{
            this.setIsFetching(true)
            const response = await CreditService.getAllCredits(bankAccountId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async tryGetCredit(userId: UUID, billId: UUID, dateStart: string, amountOfMoney: number, monthToPay: number, salary: number, procents: number){
        try{
            this.setIsFetching(true)
            const response = await CreditService.tryGetCredit(userId, billId, dateStart, amountOfMoney, monthToPay, salary, procents)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
            this.setErrorCredit(e.response?.data)
        }
    }

    async UpdateCreditPayment(billId: UUID, creditId: UUID, amountOfMoney: number, cardNumber: string, type: string){
        try{
            this.setIsFetching(true)
            const response = await CreditService.updatePayment(billId, creditId, amountOfMoney, cardNumber, type)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.status
        }
        catch (e){
            console.log(e.response?.data)
            this.setErrorCredit(e.response?.data)
        }
    }

    async GetAllAdminMessages(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetAllMessages()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data.adminMessages
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async ApproveCredit(userId: UUID, messageId: UUID, creditId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.ApproveCredit(userId, messageId, creditId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async RejectCredit(userId: UUID, messageId: UUID, creditId: UUID){
        try{
            this.setIsFetching(true)
            const response = await AdminService.RejectCredit(userId, messageId, creditId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetAllCredits(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetAllCredits()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetAllTransactions(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetAllTransactions()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetAllCards(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetAllCards()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetAllBills(){
        try{
            this.setIsFetching(true)
            const response = await AdminService.GetAllBills()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async CheckisUserBanned(userId: string){
        try{
            this.setIsFetching(true)
            const response = await AccountService.checkBanned(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async SendUnbanUserMessage(userId: string){
        try{
            this.setIsFetching(true)
            const response = await AccountService.SendUnbanMessage(userId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
            if(e.response?.data === "Заявка уже подана"){
                this.setErrorSendUnbanMessage(e.response?.data)
            }
        }
    }

    async GetOneCredit(creditId: UUID){
        try{
            this.setIsFetching(true)
            const response = await CreditService.getOneCreditById(creditId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async UpdateCreditApplicationInf(creditId: UUID, dateStart: string, amountOfMoney: number, monthToPay: number, procents: number){
        try{
            this.setIsFetching(true)
            const response  = await CreditService.updateApplicationInf(creditId, dateStart, amountOfMoney, monthToPay, procents)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }

    async GetLastMonthInf(accountId: string){
        try{
            this.setIsFetching(true)
            const response  = await TransactionsService.getLastMonthInf(accountId)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data.lastMonthInf
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async AddMoney(billId: UUID, amountOfMoney: number){
        try{
            this.setIsFetching(true)
            const response = await AdminService.AddMoney(billId, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async AddMoneyUnAllocated(billId: UUID, amountOfMoney: number){
        try{
            this.setIsFetching(true)
            const response = await AdminService.AddMoneyUnAllocated(billId, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async RemoveMoney(billId: UUID, amountOfMoney: number){
        try{
            this.setIsFetching(true)
            const response = await AdminService.RemoveMoney(billId, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async RemoveMoneyUnAllocated(billId: UUID, amountOfMoney: number){
        try{
            this.setIsFetching(true)
            const response = await AdminService.RemoveMoneyUnAllocated(billId, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async UpdateCreditValue(currency: string, month: number, amountOfMoney: number){
        try{
            this.setIsFetching(true)
            const response = await AdminService.UpdateCreditValue(currency, month, amountOfMoney)
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
    async GetAllCreditValues(){
        try{
            this.setIsFetching(true)
            const response = await CreditService.GetAllCreditValues()
            if(response !== undefined){
                this.setIsFetching(false)
            }
            return response.data.creditValues
        }
        catch (e){
            console.log(e.response?.data)
        }
    }
}