import { observer } from "mobx-react-lite"
import './ExpensesStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function Expenses({ updateExp, setUpdateExp }){
    const {globalStore} = useContext(Context)

    const [monthInf, setMonthInf]=  useState(null)
    const [billMonthInf, setBillMonthInf] = useState(null)

    const fetchMonthInf = async () => {
        const response = await globalStore.GetLastMonthInf(localStorage.getItem('accountId'))
        if(response.length != 0){
            setMonthInf(response)
            setBillMonthInf(response.filter(b => b.billNumber == localStorage.getItem('currentBillNumber'))[0])
        }
    }

    useEffect(() => {

        fetchMonthInf()

    }, [])

    useEffect(() => {
        if(monthInf != null){
            const billInf = monthInf.filter(b => b.billNumber == localStorage.getItem('currentBillNumber'))[0]
            setBillMonthInf(billInf)
        }
    }, [updateExp])

    return(
        <>
            <div className="MainExpenses">
                <p className="expensesHeader">{billMonthInf === null ? "Пока нет счетов или транзакций" : "Ваши расходы"}</p>
                {billMonthInf !== null && (
                    <>
                        <div id="diagramm" style={{
                            background: `conic-gradient(rgba(241, 107, 107, 0.5) 0.0% ${billMonthInf.procentSend}% , rgba(211, 211, 211, 1) ${billMonthInf.procentSend}% ${billMonthInf.procentReceive}%)`
                        }}>
                            <div id="diagrammHelp"></div>
                        </div>
                        <div className="billInfExpenses">
                            <p>Получено: {billMonthInf.received} <span id="moneyReceived"> {billMonthInf.procentReceive}% </span></p>
                            <p>Отправлено: {billMonthInf.sended} <span id="moneySended"> {billMonthInf.procentSend}% </span></p>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}

export default observer(Expenses)