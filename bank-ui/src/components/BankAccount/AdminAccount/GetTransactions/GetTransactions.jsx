import { observer } from "mobx-react-lite"
import './GetTransactionsStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function GetTransactions(){
    const {globalStore} = useContext(Context)

    const [transactions, setTransactions] = useState(null)

    const [currentWayToGet, setCurrentWayToGet] = useState(1)
    const [selectedTransactions, setSelectedTransactions] = useState([])
    const [necessaryInf, setNecessaryInf] = useState("")

    const fetchTransactions = async () => {
        const response = await globalStore.GetAllTransactions()
        if(response != undefined){
            console.log(response.transactions)
            setTransactions(response.transactions)
        }
    }

    function getInf(){
        if (currentWayToGet === 1){
            setSelectedTransactions(transactions)
        }
        else if(currentWayToGet === 2){
            setSelectedTransactions(transactions.filter(t => t.billId === necessaryInf))
        }
        else if(currentWayToGet === 3){
            setSelectedTransactions(transactions.filter(t => t.transactionId === necessaryInf))
        }
        else if(currentWayToGet === 4){
            setSelectedTransactions(transactions.filter(t => t.transactionIdAdmin === necessaryInf))
        }
    }

    useEffect(() => {

        fetchTransactions()

    }, [])

    return (
        <>
            <div className="transactionsAdminMainField">
                <p className="getUsersHeader">Выберите, как хотите получить транзакции</p>
                <div className="selectWayToGet">
                    <div className={currentWayToGet === 1 ? "selected" : "notselected"}
                    onClick={() => {setCurrentWayToGet(1)}}>
                        <p>Все</p>
                    </div>
                    <div className={currentWayToGet === 2 ? "selected" : "notselected"}
                    onClick={() => {setCurrentWayToGet(2)}}>
                        <p>Все со счета</p>
                    </div>
                    <div className={currentWayToGet === 3 ? "selected" : "notselected"}
                    onClick={() => {setCurrentWayToGet(3)}}>
                        <p>Пара по Id admin</p>
                    </div>
                    <div className={currentWayToGet === 4 ? "selected" : "notselected"}
                    onClick={() => {setCurrentWayToGet(4)}}>
                        <p>Одна по Id</p>
                    </div>
                </div>
                <div className="requestInfDiv">
                <button className="submitRequest" onClick={() => {getInf()}}>Получить данные</button>
                <input 
                    type="text"
                    className="necessaryInf"
                    value={necessaryInf}
                    placeholder="ID..."
                    style={{opacity: (currentWayToGet === 3 || currentWayToGet === 4 || currentWayToGet === 2) ? '1' : '0' }}
                    onChange={(event) => {
                        setNecessaryInf(event.target.value)
                    }}     
                />
            </div>
                <div className="receivedInf">
                        {selectedTransactions.map((transaction) => {
                            return (
                            <>
                                <div className="receivedUser">
                                    <p>Id: {transaction.transactionId}</p>
                                    <p>Id admin: {transaction.transactionIdAdmin}</p>
                                    <p>Дата: {transaction.date}</p>
                                    <p>Id счета отправителя: {transaction.receiverBillId}</p>
                                    <p>Номер счета отправителя: {transaction.receiverBillNumber}</p>
                                    <p>Номер карты отправителя: {transaction.receiverCard}</p>
                                    <p>Id счета получателя: {transaction.senderBillId}</p>
                                    <p>Номер счета получателя: {transaction.senderBillNumber}</p>
                                    <p>Номер карты получателя: {transaction.senderCard}</p>
                                </div>
                            </>
                            )
                        })}
                    </div>
            </div>
        </>
    )
}

export default observer(GetTransactions)