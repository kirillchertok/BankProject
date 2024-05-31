import { observer } from "mobx-react-lite"
import './CreditsStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../../main"
import { useNavigate } from "react-router-dom"
import AddCredit from "./AddCredit/AddCredit"
import AddPayment from "./AddPayment/AddPayment"
import Loader from "../../../../Loader/Loader"


function Credits(){
    const {globalStore} = useContext(Context)

    const [data, setData] = useState(null)
    const [billAddCreditData, setBillAddCreditData] = useState(null)
    const [billAddPaymentData, setBillAddPaymentData] = useState({
        'id': 123,
        'currency': 'USD',
        'leftToPayThisMonth': 1000,
        'creditId': 123
    })
    const [applicationToChangeId, setApplicationToChangeId] = useState(null)

    const fetchData = async () => {
        const response = await globalStore.getAllAccountCredits(localStorage.getItem('accountId'))
        if(response.length !== 0){
            setData(response)
        }
    }

    useEffect(() => {

        fetchData()

    }, [])

    const navigate = useNavigate()

    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
            <div className="creditsMainField">
                {globalStore.isOpenAddCredit && (
                    <>
                        <AddCredit billData={billAddCreditData} creditId={applicationToChangeId} setCreditId={setApplicationToChangeId}/>
                    </>
                )}
                {globalStore.isOpenAddPaymentToCredit && (
                    <>
                        <AddPayment billData={billAddPaymentData}/>
                    </>
                )}
                <div className="creditsMain">
                    <div className="creditsHeader">
                        <p>Ваши кредиты</p>
                        <div className="goBackButton" onClick={() => {
                            globalStore.setWasOperationBefore(false)
                            navigate('/account')
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </div>
                    </div>
                    {data === null ? (
                        <>
                            <p>Загрузка</p>
                        </>
                    ) : (
                        <>
                            {data.map((billsCredit) => {
                                const bill = billsCredit.bill
                                const creditsActive = billsCredit.credits.filter(credit => credit.endorsement === true)
                                const creditApplication = billsCredit.credits.filter(credit => credit.endorsement === false)
                                return (
                                    <>
                                        <div className="creditsField">
                                            <div className="billCreditsField">
                                                <p className="billNumberHeader">Счет: <strong>{bill.billNumber}</strong></p>
                                                <p>Активные кредиты</p>
                                                {creditsActive.length === 0 ? (
                                                    <>
                                                        <div className="mainCreditsField" data-status="noCredits">
                                                            <p>Нет активных кредитов</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                    {creditsActive.map((credit) => {
                                                        return(
                                                            <>
                                                            <div className="mainCreditsField" data-status="anyCredits">
                                                            <p>Дата начала: {credit.dateStart}</p>
                                                            <p>Общая сумма: {credit.amountOfMoney}</p>
                                                            <div className="depsThisMnth">
                                                                <p>Осталось заплатить в этом месяце: {credit.leftToPayThisMonth}</p>
                                                                <button
                                                                    className="accountBtn"
                                                                    id="payOffDepsBtn"
                                                                    onClick={() => {
                                                                        globalStore.setIsOpenAddPaymentCredit(true)
                                                                        setBillAddPaymentData({
                                                                            'id': bill.billId,
                                                                            'currency': bill.currency,
                                                                            'leftToPayThisMonth': credit.leftToPayThisMonth,
                                                                            'creditId': credit.creditId
                                                                        })
                                                                    }}
                                                                    >
                                                                    Погасить</button>
                                                            </div>
                                                            </div>   
                                                            </>
                                                        )
                                                    })}
                                                    </>
                                                )}
                                                <p>Заяки на кредиты</p>
                                                {creditApplication.length === 0 ? (
                                                    <>
                                                        <div className="mainCreditsField" data-status="noCredits">
                                                            <p>Нет заявок на кредит кредитов</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                    {creditApplication.map((credit) => {
                                                        return(
                                                            <>
                                                            <div className="mainCreditsField" data-status="anyCreditsApplication">
                                                                <div 
                                                                    className="chengeCreditApplication"
                                                                    onClick={() => {
                                                                        globalStore.setIsOpenAddCredit(true)
                                                                        setBillAddCreditData({
                                                                            'id': bill.billId,
                                                                            'currency': bill.currency
                                                                        })
                                                                        setApplicationToChangeId(credit.creditId)
                                                                    }}
                                                                    >
                                                                    <p>Редактировать: </p>
                                                                    <FontAwesomeIcon icon="fa-solid fa-pen" className="changeIcon"/>
                                                                </div>
                                                                <p>Дата подачи: {credit.dateStart}</p>
                                                                <p>Общая сумма: {credit.amountOfMoney}</p>
                                                            </div>
                                                            </>
                                                        )
                                                    })}
                                                    </>
                                                )}
                                            <button
                                                className="accountBtn"
                                                id="addCreditBtn"
                                                data-status={globalStore.wasOperationBefore} 
                                                onClick={() => {
                                                    setBillAddCreditData({
                                                        'id': bill.billId,
                                                        'currency': bill.currency
                                                    })
                                                    globalStore.setIsOpenAddCredit(true)
                                                    globalStore.setWasOperationBefore(false)
                                                }}
                                            >Подать заявку на кредит</button>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default observer(Credits)