import { observer } from "mobx-react-lite"
import './AddPaymentStyles.css'
import { useContext, useRef, useEffect, useState } from "react"
import { Context } from "../../../../../../main"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import DropDownList from "../../Account/AddBillField/DropDownList/DropDownList"

function AddPaymnet({ billData }){
    const {globalStore} = useContext(Context)

    const billId = billData.id
    const billCurrency = billData.currency
    const leftToPayThisMonth = billData.leftToPayThisMonth
    const creditId = billData.creditId

    const rootref = useRef(null)
    const rootrefField = useRef(null)

    const [addPaymentInf, setAddPaymentInf] = useState({
        'billId': billId,
        'amountOfMoney': leftToPayThisMonth/2,
        'creditId': creditId,
        'type': 'bill'
    })
    const [cards, setCards] = useState(null)

    const fetchCards = async () => {
        const response = await globalStore.getCards(billId)
        if(response.length !== 0){
            setCards(response)
        }
    }
    useEffect(() => {
        
        fetchCards()

    }, [])

    useEffect(() => {
        const closeAddPayment = (event) => {
            const {target} = event;
            if(target instanceof Node && rootref.current?.contains(target) && !rootrefField.current?.contains(target)){
                globalStore.setIsOpenAddPaymentCredit(false)
                /* clearAllInf() */
            }
        }
        window.addEventListener('click',closeAddPayment)

        return () => {
            window.removeEventListener('click',closeAddPayment)
        }
    }, [globalStore.isOpenDistributeMoney])

    async function addPayment(){
        const status = await globalStore.UpdateCreditPayment(addPaymentInf.billId, addPaymentInf.creditId, addPaymentInf.amountOfMoney, globalStore.dropDownSelectedCard, addPaymentInf.type)
        if(status === 200){
            location.reload()
        }
    }

    return (
        <>
            <div className="addPaymnetMainFiled" ref={rootref}>
                <div className="addPaymentMain" ref={rootrefField}>
                    <div className="addcreditHeader">
                        <p>Погашение задолженности</p>
                        <div className="goBackBtn" onClick={() => {
                            globalStore.setIsOpenAddPaymentCredit(false)
                            /* clearAllInf() */
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        </div>
                    </div>
                    {addPaymentInf.amountOfMoney === 0 ? (
                        <>
                            <h2>Задолденность за этот месяц погашена</h2>
                        </>
                    ) : (
                        <>
                        <div className="addPaymentInfFields">
                        <div className="chooseMoneyToPay">
                            <label htmlFor="dateCreditInput">Выберите сумму - {addPaymentInf.amountOfMoney}</label>
                            <input 
                                type="range"
                                className="casualInputAddCredit"
                                id="monthCreditinput" 
                                value={addPaymentInf.amountOfMoney}
                                min={1}
                                max={leftToPayThisMonth}
                                step={1}
                                onChange={(event) => {
                                    setAddPaymentInf((prev) => ({
                                        ...prev, amountOfMoney: event.target.value
                                    }))
                                }}
                                />
                        </div>
                        <div className="choosePaymentInf">
                            <label htmlFor="">Выберите, откуда снять средства</label>
                            <div className="choosePaymentType">
                                <div 
                                    className="type" 
                                    data-status={addPaymentInf.type === 'bill' ? "selected" : "notselected"}
                                    onClick={() => {
                                        globalStore.setDropDownSelectedCard("")
                                        setAddPaymentInf((prev) => ({
                                            ...prev, type: 'bill'
                                        }))
                                    }}
                                    >
                                    <p>С текущего счета</p>
                                </div>
                                <div 
                                    className="type" 
                                    id="typeByCard"
                                    data-status={addPaymentInf.type === 'card' ? "selected" : "notselected"}
                                    onClick={() => {
                                        globalStore.setDropDownSelectedCard(cards[0].cardNumber)
                                        setAddPaymentInf((prev) => ({
                                            ...prev, type: 'card'
                                        }))
                                    }}
                                    >
                                    <p>С карты</p>
                                </div>
                            </div>
                            {addPaymentInf.type === 'card' && (
                                <>
                                    <div className="addPaymentDropDown">
                                    <DropDownList type="card" typeData={cards} />
                                    </div>
                                </>
                            )}
{/*                             {addPaymentInf.type === 'card' && (
                                <>
                                    <DropDownList type="cards" typeData={cards} />
                                </>
                            )} */}
                            <div className="addPaymentEnd">
                                <button
                                    className="accountBtn"
                                    id="confirmPaymentBtn"
                                    onClick={() => {
                                        addPayment()
                                    }}
                                    >
                                    Подтвердить
                                </button>
                                <p>{globalStore.errorCreditPayment}</p>
                            </div>
                        </div>
                    </div>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default observer(AddPaymnet)