import { observer } from "mobx-react-lite"
import './DistributeMoney.css'
import { useState, useEffect, useContext, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Context } from "../../../../../../../main"

function DistributeMoney({ billData }){
    const {globalStore} = useContext(Context)
    
    const bill = billData.bill
    const cards = billData.cards

    const rootref = useRef(null)
    const rootrefField = useRef(null)

    const [moneyToDistribute, SetMoneyToDistribute] = useState(bill.amountOfMoneyUnAllocated / 2)
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if(cards !== null){
            const lastIndex = cards.length - 1;
            /* localStorage.removeItem('currentCard') */
            if(currentIndex < 0){
                setCurrentIndex(lastIndex)
                /* localStorage.setItem('currentCard', cards[lastIndex]) */
            }
            if(currentIndex > lastIndex){
                setCurrentIndex(0)
                /* localStorage.setItem('currentCard', cards[0]) */
            }
            /* if(!localStorage.getItem('currentCard')){
                localStorage.setItem('currentCard', cards[currentIndex])
            } */
        }
    }, [currentIndex])

    /* useEffect(() => {
        if(cards !== null){
            localStorage.setItem('currentCard', cards[0])
        }
    }, []) */

    useEffect(() => {
        const closeDistribute = (event) => {
            const {target} = event;
            if(target instanceof Node && rootref.current?.contains(target) && !rootrefField.current?.contains(target)){
                globalStore.setIsOpenDistributeMoney(false)
            }
        }
        window.addEventListener('click',closeDistribute)

        return () => {
            window.removeEventListener('click',closeDistribute)
        }
    }, [globalStore.isOpenDistributeMoney])

    function convertCardNumber(str){
        return str.slice(0,4)+ " " + str.slice(4,8) + " " + str.slice(8,12) + " " + str.slice(12,16)
    }
    function distrubuteMoney(){
        globalStore.DistributeMoney(cards[currentIndex].billId, moneyToDistribute, cards[currentIndex].cardNumber)
        location.reload()
    }
    return(
        <>
            <div className="distributeMoneyField" ref={rootref}>
                <div className="distributeMoney" ref={rootrefField}>
                    <h2 className="distributeMoneyHeader">Распределение средств</h2>
                    <div className="chooseValue">
                        <div className="chooseValueText">
                            <span>У вас есть {bill.amountOfMoneyUnAllocated} нераспределенных средств</span>
                            <span>Выберите сумму</span>
                            <span><strong>{moneyToDistribute}</strong></span>
                        </div>
                        <div className="distributeData">
                            <input 
                                type="range"
                                min={1}
                                max={bill.amountOfMoneyUnAllocated}
                                step={1}
                                value={moneyToDistribute}
                                onChange={(event) => {
                                    SetMoneyToDistribute(event.target.value)
                                }} 
                                className="rangeDistributeMoney"
                            />
                            <div className="selectCard">
                                {billData.cards === null ? (
                                    <>
                                        <p>У вас пока нет карт, куда бы вы могли распределть средства</p>
                                        <button>Добавить карту</button>
                                    </>
                                ) : (
                                    <>
                                        {cards.map((card, index) => {
                                            let position = 'nextSlide';
                                            if(cards.length != 1){
                                                if(index === currentIndex){
                                                    position = 'activeSlide';
                                                }
            
                                                if(index === currentIndex - 1 || (currentIndex === 0 && index === cards.length - 1)){
                                                    position = 'lastSlide';
                                                }
                                            }
                                            else{
                                                position = 'activeSlide'
                                            }
                                            return(
                                                <>
                                                    <article className={position} key={index}>
                                                        <div className="cardInfIcon">
                                                            <FontAwesomeIcon icon="fa-solid fa-credit-card" />
                                                        </div>
                                                        <div className="cardInf">
                                                            <p>Номер карты:</p>
                                                            <p><strong>{convertCardNumber(card.cardNumber)}</strong></p>
                                                            <p className="amountOfMoneyText">Количество средств:</p>
                                                            <p className="amountOfMoneyNumber"><strong>{card.amountOfMoney}</strong></p>
                                                        </div>
                                                    </article>
                                                </>
                                            )
                                        })}
                                    </>
                                )}
                                <div className="leftButton" data-status={cards.length === 1 ? "blackout" : "noblackout"} onClick={() => {
                                    if(cards.length !== 1){
                                        setCurrentIndex(prev => prev - 1)
                                    }
                                    }}>
                                    <FontAwesomeIcon icon="fa-solid fa-angle-left" />
                                </div>
                                <div className="rightButton" data-status={cards.length === 1 ? "blackout" : "noblackout"} onClick={() => {
                                    if(cards.length !== 1){
                                        setCurrentIndex(prev => prev + 1)
                                    }
                                    }}>
                                    <FontAwesomeIcon icon="fa-solid fa-angle-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                <button 
                    className="accountBtn" 
                    id="confirmDistribute"
                    onClick={() => {
                        distrubuteMoney()
                    }}
                    >Подтвердить</button>
                </div>
            </div>
        </>
    )
}

export default observer(DistributeMoney)