import { ITransaction } from "../models/ITransaction";

export default class SortTransactions{
    static sort(
            array: ITransaction[], 
            order: string, 
            type: string, 
            dataType: string, 
            extraDataType: string, 
            data: string, 
            extraData: string
        ){
        let resultArray = this.sortByOrder(array, order);

        if(type === ""){
            return resultArray
        }

        return this.sortByData(resultArray, type, dataType, extraDataType, data, extraData)
    }

    static sortByOrder(array: ITransaction[], order: string){
        if(order === "DateLast"){
            return array.sort(
                (a,b) => 
                    -(Date.parse(a.date) - Date.parse(b.date))
            );
        }
        else if(order === "DateFirst"){
            return array.sort(
                (a,b) => 
                    -(Date.parse(a.date) - Date.parse(b.date))
            ).reverse();
        }
        else if(order === "SumToBig"){
            return array.sort(
                (a,b) => 
                    a.amountOfMoney.valueOf() - b.amountOfMoney.valueOf()
            );
        }
        else if(order === "SumToSmall"){
            return array.sort(
                (a,b) => 
                    a.amountOfMoney.valueOf() - b.amountOfMoney.valueOf()
            ).reverse();
        }

        return []
    }

    static sortByData(
        array: ITransaction[], 
        type: string, 
        dataType: string, 
        extraDataType: string,
        data: string, 
        extraData: string
    ){
        if(type === "Sender"){
            if(dataType === "Card"){
                return array.filter((transaction) => transaction.senderCard === data)
            }
            else if(dataType === "Bill"){
                return array.filter((transaction) => transaction.senderBillNumber === data)
            }
        }
        else if(type === "Receiver"){
            if(dataType === "Card"){
                array.map((trs) => {
                    console.log(trs.receiverCard)
                    console.log(data)
                })
                return array.filter((transaction) => transaction.receiverCard === data)
            }
            else if(dataType === "Bill"){
                return array.filter((transaction) => transaction.receiverBillNumber === data)
            }
        }
        else if(type === "Sender/Receiver"){
            if(dataType === "Card"){
                if(extraDataType === "Card"){
                    return array.filter((transaction) => (transaction.senderCard === data && transaction.receiverCard === extraData)) 
                }
                else if(extraDataType === "Bill"){
                    return array.filter((transaction) => (transaction.senderCard === data && transaction.receiverBillNumber === extraData))
                }
            }
            else if(dataType === "Bill"){
                if(extraDataType === "Card"){
                    return array.filter((transaction) => (transaction.senderBillNumber === data && transaction.receiverCard === extraData))
                }
                else if(extraDataType === "Bill"){
                    return array.filter((transaction) => (transaction.senderBillNumber === data && transaction.receiverBillNumber === extraData))
                }
            }
        }

        return []
    }
} 