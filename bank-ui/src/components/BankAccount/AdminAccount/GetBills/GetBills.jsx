import { observer } from "mobx-react-lite"
import './GetBillsStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function GetBills(){
    const {globalStore} = useContext(Context)

    const [bills, setBills] = useState(null)
    const [selectedBills, setSelectedBills] = useState([])
    const [currentWayToGet, setCurrentWayToGet] = useState(1)
    const [necessaryInf, setNecessaryInf] = useState("")

    const fetchBills = async () => {
        const response = await globalStore.GetAllBills()
        if(response.bills.length != 0){
            console.log(response.bills)
            setBills(response.bills)
        }
    }

    useEffect(() => {

        fetchBills()

    }, []) 

    function getInf(){
        if(currentWayToGet === 1){
            setSelectedBills(bills)
        }
        else if(currentWayToGet === 2){
            setSelectedBills(bills.filter((bill) => bill.bankAccountId === necessaryInf))
        }
        else if(currentWayToGet === 3){
            setSelectedBills(bills.filter((bill) => bill.billId === necessaryInf))
        }
    }

    return(
        <>
        <div className="getBillsMain">
            <p className="getUsersHeader">Выберите, как вы хотите получить данные по счетам</p>
            <div className="selectWayToGet">
                <div className={currentWayToGet === 1 ? "selected" : "notselected"}
                onClick={() => {setCurrentWayToGet(1)}}>
                    <p>Все счета</p>
                </div>
                <div className={currentWayToGet === 2 ? "selected" : "notselected"}
                onClick={() => {setCurrentWayToGet(2)}}>
                    <p>Счета аккаунта</p>
                </div>
                <div className={currentWayToGet === 3 ? "selected" : "notselected"}
                onClick={() => {setCurrentWayToGet(3)}}>
                    <p>Счет по ID</p>
                </div>
            </div>
            <div className="requestInfDiv">
                <button className="submitRequest" onClick={() => getInf()}>Получить данные</button>
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
                {selectedBills.map((bill) => {
                    return (
                        <>
                            <div className="receivedUser">
                                <p>Id : {bill.billId}</p>
                                <p>Номер счета : {bill.billNumber}</p>
                                <p>Средства : {bill.amountOfMoney} {bill.currency}</p>
                                <p>Нераспределенные средства : {bill.amountOfMoneyUnAllocated} {bill.currency}</p>
                                <p>ID аккаунта : {bill.bankAccountId}</p>
                            </div>
                        </>
                    )
                })}
            </div>
        </div>
        </>
    )
}

export default observer(GetBills)