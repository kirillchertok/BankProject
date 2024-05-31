import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from 'react-router-dom'
import './CardsStyle.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../../main"
import Loader from "../../../../Loader/Loader"

function Cards(){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    const [cards, setCards] = useState(null)
    const [seePinCodes, setSeePinCodes] = useState(false)
    const [newCardField, setNewCardField] = useState(false)
    const [currentPaymentSystem, setCurrentPaymentSystem] = useState(4)
    const [currentColor, setCurrentColor] = useState("red")
    const [pinCode, setPinCode] = useState("")
    const [CVV, setCVV] = useState("")
    const [userName, setUserName] = useState("")

    const fetchCards = async () => {
        const cardsGet = await globalStore.getCards(localStorage.getItem('currentBill'));
        console.log(cardsGet)
        setCards(cardsGet)
    }

    const convertPin = (length) => {
        let str = ""
        for(let i = 0 ; i < length; i++){
            str += "*"
        }
        return str
    }

    useEffect(() => {
        fetchCards()
    },[])

    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
            <div className="cardsMain">
                <div className="cardsMainField">
                    <div className="headerField">
                        <p>Карты</p>
                        <div className="goBackButton" onClick={() => {
                            globalStore.setWasOperationBefore(false)
                            navigate('/account')
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </div>
                    </div>
                    <div className="billCards">
                        <div className="billCardsBtns">
                            <button 
                                className="addCardBtn" 
                                data-status={globalStore.wasOperationBefore} 
                                onClick={() => {
                                    globalStore.setWasOperationBefore(false)
                                    setNewCardField(true)
                                }}
                                >Добавить карту</button>
                            <button 
                                className="seePinCodes" 
                                style={{opacity: newCardField === true ? '0' : '1' }} 
                                onClick={() => {
                                    setSeePinCodes((prev) => (!prev))
                                }}
                                >{seePinCodes === false ? "Показать" : "Спрятать"} пинкоды</button>
                        </div>
                        <div className="allCards">
                            {newCardField === true ? (
                                <>
                                    <div className="newCardField">
                                        <div className="newCardHeader">
                                            <p>Введите данные новой карты</p>
                                            <FontAwesomeIcon icon="fa-solid fa-circle-xmark" className="closeBtn" onClick={() => {setNewCardField(false)}}/>
                                        </div>
                                        <div className="newCard">
                                        <div className="newCardInputs">
                                            <div className="paymentSystemInput">
                                                <div className={currentPaymentSystem === 4 ? "selected" : "notselected"}
                                                onClick={() => {setCurrentPaymentSystem(4)}}>
                                                    <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                                                </div>
                                                <div className={currentPaymentSystem === 5 ? "selected" : "notselected"}
                                                onClick={() => {setCurrentPaymentSystem(5)}}>
                                                    <FontAwesomeIcon icon="fa-brands fa-cc-mastercard" />
                                                </div>
                                                <div className={currentPaymentSystem === 2 ? "selected" : "notselected"}
                                                onClick={() => {setCurrentPaymentSystem(2)}}>
                                                    <p>МИР</p>
                                                </div>
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="Пин-код..."
                                                value={pinCode}
                                                onChange={(event) => {
                                                    setPinCode(event.target.value)
                                                }}/>
                                            <input 
                                                type="text"
                                                placeholder="CVV..."
                                                value={CVV}
                                                onChange={(event) => {
                                                    setCVV(event.target.value)
                                                }}/>
                                            <div className="colorInput">
                                                <div className={currentColor === "red" ? "selected" : "notselected"}
                                                onClick={() => {setCurrentColor("red")}}>
                                                    <p>Красный</p>
                                                </div>
                                                <div className={currentColor === "black" ? "selected" : "notselected"}
                                                onClick={() => {setCurrentColor("black")}}>
                                                    <p>Черный</p>
                                                </div>
                                                <div className={currentColor === "gold" ? "selected" : "notselected"}
                                                onClick={() => {setCurrentColor("gold")}}>
                                                    <p>Золотой</p>
                                                </div>
                                                <div className={currentColor === "white" ? "selected" : "notselected"}
                                                onClick={() => {setCurrentColor("white")}}>
                                                    <p>Белый</p>
                                                </div>
                                            </div>
                                            <input 
                                                type="text"
                                                placeholder="Имя пользователя..."
                                                value={userName}
                                                onChange={(event) => {
                                                    setUserName(event.target.value)
                                                }}/>
                                            <button className="submitNewCard"
                                            onClick={() => {
                                                globalStore.AddCard(
                                                    localStorage.getItem('currentBill'), 
                                                    (currentPaymentSystem === 4 ? "VISA" : 
                                                        (currentPaymentSystem === 5 ? "MasterCard" : "МИР")),
                                                    pinCode,
                                                    CVV,
                                                    currentColor,
                                                    userName
                                                )
                                                /* fetchCards() */
                                                location.reload()
                                            }}>Подтвердить</button>
                                        </div>
                                        <div className="newCardOutput">
                                            <div className="newCardFrontPart">
                                                <div className="newCardFrontPartHeader">
                                                    <p>Валюта счета</p>
                                                    <p>BANK</p>
                                                </div>
                                                <div className="chip"></div>
                                                <div className="newCardFrontPartFotter">
                                                    <p className="newCardFrontPartFotterUserName">{userName}</p>
                                                    {currentPaymentSystem === 4 ? (
                                                        <>
                                                            <FontAwesomeIcon icon="fa-brands fa-cc-visa" />
                                                        </>
                                                    ) : (currentPaymentSystem === 5 ? (
                                                        <>
                                                            <FontAwesomeIcon icon="fa-brands fa-cc-mastercard" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>МИР</p>
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="newCardRearPart">
                                                <p className="contactNumber">+375 (29/44/55) 000-00-00</p>
                                                <div className="magneticTape"></div>
                                                <div className="newCardRearPartMain">
                                                    <div className="CVVandDateEnd">
                                                        <p>VALID THRU 00/00</p>
                                                        <p className="secutityCode">SECUTITY CODE {CVV}</p>
                                                    </div>
                                                    <p className="cardNumberText">{currentPaymentSystem}XXX XXXX XXXX XXXX</p>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {cards === null ? "" : (
                                    <>
                                        {cards.length === 0 ? (
                                            <>
                                                <div className="noCards">
                                                    <p>К этому счету пока не привязаны карты. Воспользуйтесь кнопкой <q>Добавить карту</q></p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                {cards.map((card) => {
                                                    return(
                                                        <>
                                                        <div className="card">
                                                            <div className="cardIcon">
                                                                <FontAwesomeIcon icon="fa-solid fa-credit-card" />
                                                            </div>
                                                            <div className="cardInfCards">
                                                                <p>Номер карты: <strong>{card.cardNumber}</strong></p>
                                                                <p>Имя пользователя: <strong>{card.userName}</strong></p>
                                                                <p>Пин-код: {seePinCodes === false ? convertPin(card.pinCode.length) : <strong>{card.pinCode}</strong>}</p>
                                                            </div>
                                                            <p className="cardAmountofMoney">{card.amountOfMoney}</p>
                                                        </div>
                                                        </>
                                                    )
                                                })}
                                            </>
                                        )}
                                    </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default observer(Cards)
