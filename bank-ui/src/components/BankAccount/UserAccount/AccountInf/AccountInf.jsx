import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './AccountInfStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"
import { useNavigate } from "react-router-dom"

function AccountInf({ updateExp, setUpdateExp }){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    const [bills, setBills] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    const fetchData = async () => {
        const response = await globalStore.GetTrsBillsData(localStorage.getItem('accountId'))
        if(response.billsData.length !== 0){
            const fetchedBills = response.billsData.map((billData) => billData.bill)
            const fetchedTransactions = response.billsData.map((billData) => billData.transactions)

            const fetchedBillsNumber = fetchedBills.map((bill) => bill.billNumber)
            localStorage.setItem('billsNumbers', fetchedBillsNumber)

            setBills(fetchedBills)
            setTransactions(fetchedTransactions)
            if(fetchedBills.length !== 0){
                localStorage.setItem('currentBill', fetchedBills[0].billId)
                localStorage.setItem('currentBillNumber', fetchedBills[0].billNumber)
            }    
        }
    }

    useEffect(() => {
        fetchData()

        const updateData = setInterval(() => {
            fetchData()
        }, 60000);

        return () => {
            clearInterval(updateData);
        } 
    }, [])

    useEffect(() => {
        if(bills !== null){
            const lastIndex = bills.length - 1;
            localStorage.removeItem('currentBill')
            localStorage.removeItem('currentBillNumber')
            if(currentIndex < 0){
                setCurrentIndex(lastIndex)
                localStorage.setItem('currentBill', bills[lastIndex].billId)
                localStorage.setItem('currentBillNumber', bills[lastIndex].billNumber)
            }
            if(currentIndex > lastIndex){
                setCurrentIndex(0)
                localStorage.setItem('currentBill', bills[0].billId)
                localStorage.setItem('currentBillNumber', bills[0].billNumber)
            }
            if(!localStorage.getItem('currentBill')){
                localStorage.setItem('currentBill', bills[currentIndex].billId)
                localStorage.setItem('currentBillNumber', bills[currentIndex].billNumber)
            }
        }
    }, [currentIndex])

    const parseString = (date) => {
        const dateTmp = new Date(date)
        const str = (
            dateTmp.getFullYear()
            + "-" +
            ((dateTmp.getMonth() + 1).toString().length < 2 ? ("0" + (dateTmp.getMonth() + 1).toString()) : (dateTmp.getMonth() + 1).toString())
            + "-" +
            (dateTmp.getDate().toString().length < 2 ? ("0" + dateTmp.getDate().toString()) : dateTmp.getDate().toString())
        )
        const tmpStr = str.replace(/-/g,'.')
        return (tmpStr.slice(8) + "." + tmpStr.slice(5,7) + "." + tmpStr.slice(0, 4))
    }
    return(
        <>
            <div className="MainAccountInf">
                <div className="CurrentBill">
                    {bills === null ? (
                        <>
                        <div className="suggestionToAdd">
                            <p>У вас пока нет счетов</p>
                            <button onClick={() => {
                                /* globalStore.addBill(localStorage.getItem('accountId'), "USD", "Физ. лицо", "Предпринимательство") */
                                globalStore.setWasOperationBefore(true)
                                navigate('/account/userAccount')
                                }}>Добавить счет</button>
                        </div>
                        </>
                    ) : (
                        <>
                            <div className="carousel">
                                {bills.map((bill, index) => {
                                    let position = 'nextSlide';
                                    if(bills.length != 1){
                                        if(index === currentIndex){
                                            position = 'activeSlide';
                                        }
    
                                        if(index === currentIndex - 1 || (currentIndex === 0 && index === bills.length - 1)){
                                            position = 'lastSlide';
                                        }
                                    }
                                    else{
                                        position = 'activeSlide'
                                    }

                                    return(
                                        <>
                                        <article className={position} key={index} data-status={bill.billId}>
                                            <div className="billInf">
                                                <p>Номер счета: {bill.billNumber}</p>
                                            </div>
                                            <div className="moneyInf">
                                                <p>Распределенные средства: {bill.amountOfMoney} 
                                                {bill.currency === "USD" ? " $" : (
                                                    bill.currency === "RUB" ? " ₽" : (
                                                        bill.currency === "EUR" ? " €" : " Br"
                                                    )
                                                )}
                                                </p>
                                                <p>Нераспределенные средства: {bill.amountOfMoneyUnAllocated}
                                                {bill.currency === "USD" ? " $" : (
                                                    bill.currency === "RUB" ? " ₽" : (
                                                        bill.currency === "EUR" ? " €" : " Br"
                                                    )
                                                )}
                                                </p>
                                            </div>
                                        </article> 
                                    </>
                                )
                                })}
                                <div className="leftButton" data-status={bills.length === 1 ? "blackout" : "noblackout"} onClick={() => {
                                    setUpdateExp((prev) => !prev)
                                    if(bills.length !== 1){
                                        setCurrentIndex(prev => prev - 1)
                                    }
                                    }}>
                                    <FontAwesomeIcon icon="fa-solid fa-angle-left" />
                                </div>
                                <div className="rightButton" data-status={bills.length === 1 ? "blackout" : "noblackout"} onClick={() => {
                                    setUpdateExp((prev) => !prev)
                                    if(bills.length !== 1){
                                        setCurrentIndex(prev => prev + 1)
                                    }
                                    }}>
                                    <FontAwesomeIcon icon="fa-solid fa-angle-right" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="Trs">
                    {bills === null ? "" : (
                        <>
                            {transactions.length == 0 ? (
                                <>
                                    {/* <div>Какая-то ошибка</div>
                                    <div> {transactions}123</div> */}
                                    <div></div>
                                </>
                            ) : (
                                <>
                                    <div className="carouselTransactions">
                                        {transactions.map((transactionsData, index) => {
                                            let position = 'nextSlide';
                                            if(bills.length != 1){
                                                if(index === currentIndex){
                                                    position = 'activeSlide';
                                                }
            
                                                if(index === currentIndex - 1 || (currentIndex === 0 && index === bills.length - 1)){
                                                    position = 'lastSlide';
                                                }
                                            }
                                            else{
                                                position = 'activeSlide'
                                            }
                                        return(
                                            <>
                                                <article className={position} key={index}>
                                                    {transactionsData.length === 0 ? (
                                                        <>
                                                            <div className="noTrs">
                                                                Пока нет транзикций на этом счету
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="Transactions">
                                                                {transactionsData.map(tr => {
                                                                return(
                                                                <>
                                                                    {tr.senderBillNumber !== tr.receiverBillNumber && (
                                                                        <>
                                                                            <div className="Transaction" data-status={tr.senderBillNumber === bills[index].billNumber ? "Sender" : "Receiver"}>
                                                                        <div className="transactionIcon">
                                                                        {tr.senderBillNumber === bills[index].billNumber ? (
                                                                            <>
                                                                                <FontAwesomeIcon icon="fa-solid fa-arrow-trend-down" />
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FontAwesomeIcon icon="fa-solid fa-money-bills" />
                                                                            </>
                                                                        )}
                                                                        </div>
                                                                        <div className="transactionInf">
                                                                            <div className="billNumber">
                                                                                {tr.senderBillNumber === bills[index].billNumber ? (
                                                                                    <>
                                                                                        <p>Получатель :</p>
                                                                                        <p>{tr.receiverBillNumber}</p>
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <p>Отправитель :</p>
                                                                                        <p>{tr.senderBillNumber}</p>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                            <div className="transactionDate">
                                                                                <FontAwesomeIcon icon="fa-solid fa-calendar" />
                                                                                <p>{parseString(tr.date)}</p>
                                                                            </div>
                                                                            <div className="amountOfMoney">
                                                                                <p>{tr.amountOfMoney}</p>
                                                                                <p>
                                                                                {bills[index].currency === "USD" ? " $" : (
                                                                                    bills[index].currency === "RUB" ? " ₽" : (
                                                                                        bills[index].currency === "EUR" ? " €" : " Br"
                                                                                        )
                                                                                 )}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                        </>
                                                                    )}
                                                                </>
                                                            )
                                                            })}
                                                            </div>
                                                        </>
                                                    )}
                                                </article>
                                            </>
                                        )
                                        })}
                                    </div>
                                    
                                </>
                            )}
                        </>
                    )}
                        
                </div>
            </div>
        </>
    )
}

export default observer(AccountInf)