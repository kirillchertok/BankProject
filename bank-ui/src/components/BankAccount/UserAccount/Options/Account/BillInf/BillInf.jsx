import { observer } from "mobx-react-lite"
import './BillInfStyle.css'
import { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import CardSmallField from "./CardSmallField/CardSmallField"
import CreditSmallField from "./CreditSmallField/CreditSmallField"
import { Context } from "../../../../../../main"
import { useNavigate } from "react-router-dom"


function BillInf({ billData }){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    const [cardsState, setCardsState] = useState("hiden")
    const [creditsState, setCreditState] = useState("hiden")

    return(
        <>
        <div className="billInfAccount">
            <div className="mainBillInf">
                <span>Номер счета: {billData.bill.billNumber}</span>
                <span>Валюта: {billData.bill.currency}</span>
                <span>Распределенные средства: {billData.bill.amountOfMoney}</span>
                <div className="unallocatedMonye">
                    <span>Нераспределенные средства: {billData.bill.amountOfMoneyUnAllocated}</span>
                    <button className="distributeMoneyBtn" onClick={() => {
                        globalStore.setBillToDistribute(billData)
                        globalStore.setIsOpenDistributeMoney(true)
                    }}>Распределить</button>
                </div>
            </div>
            <div 
                className="showInfBtns"
                id="showCardsBtn"  
                data-status={cardsState}
                onClick={() => {
                    if(cardsState === "hiden"){
                        setCardsState("nothiden")
                    }
                }}
                >
                {cardsState === "hiden" ? (
                    <>
                        <span>Показать карты</span>
                    </>
                ) : (
                    <>
                        <div className="billInfFields">
                            <div className="billInfHeaders">
                                <span>Ваши карты</span>
                                <div 
                                    className="billInfHeadersIcons"
                                    onClick={() => {
                                        setCardsState("hiden")
                                    }}
                                    >
                                    <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                                </div>
                            </div>
                            {billData.cards.length === 0 ? (
                                <>
                                    <div className="noItemsFields">
                                        <h3>У вас пока нет карт</h3>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {billData.cards.map((cardData, index) => {
                                        return(
                                            <>
                                                <CardSmallField cardData={cardData} key={index}/>
                                            </>
                                            )
                                    })}
                                </>
                            )}
                            <button 
                                className="accountBtn smallAccountBtns" 
                                id="addCardBtn"
                                onClick={() => {
                                    globalStore.setWasOperationBefore(true)
                                    navigate('/account/Cards')
                                }}
                                >Добавить карту</button>
                        </div>
                    </>
                )}
            </div>
            <div 
                className="showInfBtns"
                id="showCreditsBtn" 
                data-status={creditsState}
                onClick={() => {
                    if(creditsState === "hiden"){
                        setCreditState("nothiden")
                    }
                }}
                >
                {creditsState === "hiden" ? (
                    <>
                        <span>Показать кредиты</span>
                    </>
                ) : (
                    <>
                        <div className="billInfFields">
                            <div className="billInfHeaders">
                                <span>Ваши кредиты</span>
                                <div 
                                    className="billInfHeadersIcons"
                                    onClick={() => {
                                        setCreditState("hiden")
                                    }}
                                    >
                                    <FontAwesomeIcon icon="fa-solid fa-circle-xmark" />
                                </div>
                            </div>
                            {billData.credits.length === 0 ? (
                                <>
                                    <div className="noItemsFields">
                                        <h3>У вас пока нет кредитов</h3>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {billData.credits.map((creditData, index) => {
                                        return(
                                            <>
                                                <CreditSmallField creditData={creditData} key={index} status={creditData.endorsement}/>
                                            </>
                                        )
                                    })}
                                </>
                            )}
                            <button 
                                className="accountBtn smallAccountBtns" 
                                id="addCreditBtn"
                                onClick={() => {
                                    globalStore.setWasOperationBefore(true)
                                    navigate('/account/Credits')
                                }}
                                >Добавить кредит</button>
                        </div>
                    </>
                )}
            </div>
        </div>
        </>
    )
}

export default observer(BillInf)