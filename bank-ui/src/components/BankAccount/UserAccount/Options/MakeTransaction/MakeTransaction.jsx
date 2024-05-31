import { observer } from "mobx-react-lite"
import './MakeTransactionStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { Context } from "../../../../../main"
import Loader from "../../../../Loader/Loader"

function MakeTransaction(){

    const {globalStore} = useContext(Context)

    const [selectedMethod, setSelectedMethod] = useState(1)
    const [senderInf, setSenderInf] = useState("")
    const [receiverInf, setReceiverInf] = useState("")
    const [amountOfMoney, setAmountOfMoney] = useState("")

    const amountOfNumbersSender = [
        20,
        20,
        16,
        16
    ]
    const amountOfNumbersReceiver = [
        20,
        16,
        20,
        16
    ]

    const date = new Date()
    const currentDate = date.toString()

    function addTransaction(){
        const aOM = Number(amountOfMoney);
        if(senderInf === receiverInf){
            globalStore.setErrorTransaction("Данные отравителя и получателя не могут совпадать")
            return
        }

        if(senderInf.length < amountOfNumbersSender[selectedMethod - 1] || receiverInf.length < amountOfNumbersReceiver[selectedMethod - 1]){
            globalStore.setErrorTransaction("Неккоректные данные")
            return
        }

        if(selectedMethod === 1){
            globalStore.addTransactionBillBill(localStorage.getItem('accountId'), currentDate, senderInf, receiverInf, aOM)
        }
        else if(selectedMethod === 2){
            globalStore.addTransactionBillCard(localStorage.getItem('accountId'), currentDate, senderInf, receiverInf, aOM)
        }
        else if(selectedMethod === 3){
            globalStore.addTransactionCardBill(localStorage.getItem('accountId'), currentDate, senderInf, receiverInf, aOM)
        }
        else if(selectedMethod === 4){
            globalStore.addTransactionCardCard(localStorage.getItem('accountId'), currentDate, senderInf, receiverInf, aOM)
        }
    }

    const navigate = useNavigate()

    function ClearInf(){
        setSenderInf("")
        setReceiverInf("")
        setAmountOfMoney("")
    }

    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
            <div className="mainMakeTransaction">
                <div className="mainField">
                    <div className="headerField">
                        <p>Перевод средств</p>
                        <div className="goBackButton" onClick={() => {
                            globalStore.setErrorTransaction("")
                            navigate('/account')
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </div>
                    </div>
                    <div className="selectMethod">
                        <div className="methods">
                            <div className={selectedMethod === 1 ? "selected" : "notselected"} onClick={() => {
                                globalStore.setErrorTransaction("")
                                ClearInf()
                                setSelectedMethod(1)
                            }}>
                                <p>Счет - счет</p>
                            </div>
                            <div className={selectedMethod === 2 ? "selected" : "notselected"} onClick={() => {
                                globalStore.setErrorTransaction("")
                                ClearInf()
                                setSelectedMethod(2)
                            }}>
                                <p>Счет - карта</p>
                            </div>
                            <div className={selectedMethod === 3 ? "selected" : "notselected"} onClick={() => {
                                globalStore.setErrorTransaction("")
                                ClearInf()
                                setSelectedMethod(3)
                            }}>
                                <p>Карта - счет</p>
                            </div>
                            <div className={selectedMethod === 4 ? "selected" : "notselected"} onClick={() => {
                                globalStore.setErrorTransaction("")
                                ClearInf()
                                setSelectedMethod(4)
                            }}>
                                <p>Карта - карта</p>
                            </div>
                        </div>
                    </div>
                    <div className="methodData">
                        <div className="cautinaryNote">
                            {selectedMethod === 1 ? (<><p>При выборе метода <q>Счет - счет</q> у отправителя снимутся деньги с первой карты счета на которой будет достаточно средств и переведутся получателю на счет в раздел <q>Нераспределенные</q>, откуда он сможет выбрать карту на которую он хочет перевести деньги</p></>) : 
                                (selectedMethod === 2 ? (<><p>При выборе метода <q>Счет - карта</q> у отправителя снимутся деньги с первой зарегестрированной карты счета и переведутся получателю на выбранную карту</p></>) :
                                    selectedMethod === 3 ? (<><p>При выборе метода <q>Карта - счет</q> у отправителя снимутся деньги с выбранной карты и переведутся получателю на счет в раздел <q>Нераспределенные</q>, откуда он сможет выбрать карту на которую он хочет перевести деньги</p></>) : (<><p>При выборе метода <q>Карта - карта</q> у отправителя снимутся деньги с выбранной карты и переведутся получателю на выбранную карту</p></>))}
                        </div>
                        <p className="separatorLine">Поля для ввода</p>
                        <div className="methodInput">
                            <input 
                                type="text"
                                value={senderInf}
                                onChange={(event) => {
                                    setSenderInf((prev) => ((/\d+/.test(Number((event.target.value)[event.target.value.length - 1]))) === false && event.target.value.length !== 0 ? 
                                    (prev) : 
                                    (event.target.value.length > amountOfNumbersSender[selectedMethod - 1] ? (prev) : (event.target.value))))
                                }}
                                placeholder={selectedMethod === 1 ? "Номер счета отправителя..." : 
                                                (selectedMethod === 2 ? "Номер счета отправителся..." : 
                                                    (selectedMethod === 3 ? "Номер карты отправителя..." : "Номер карты отправителя..."))}
                                />
                            <input 
                                type="text" 
                                value={receiverInf}
                                onChange={(event) => {
                                    setReceiverInf((prev) => ((/\d+/.test(Number((event.target.value)[event.target.value.length - 1]))) === false && event.target.value.length !== 0 ? 
                                    (prev) : 
                                    (event.target.value.length > amountOfNumbersReceiver[selectedMethod - 1] ? (prev) : (event.target.value))))
                                }}
                                placeholder={selectedMethod === 1 ? "Номер счета получателя..." : 
                                                (selectedMethod === 2 ? "Номер карты получателся..." : 
                                                    (selectedMethod === 3 ? "Номер счета получателя..." : "Номер карты получателся..."))}
                                />
                            <input 
                                type="text"
                                value={amountOfMoney}
                                onChange={(event) => {
                                    setAmountOfMoney((prev) => ((/\d+/.test(Number((event.target.value)[event.target.value.length - 1]))) === false && event.target.value.length !== 0 ? 
                                    (prev) : 
                                    (event.target.value)))
                                }}
                                placeholder="Сумма..." 
                                />
                            <div className="requestResponsTools">
                                <button className="confirmInf" onClick={() => addTransaction()}>Отправить средства</button>
                                <p>{globalStore.errorTransaction}</p>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default observer(MakeTransaction)