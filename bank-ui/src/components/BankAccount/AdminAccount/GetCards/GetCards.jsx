import { observer } from "mobx-react-lite"
import './GetCardsStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function GetCards(){
    const {globalStore} = useContext(Context)

    const [cards, setCards] = useState(null)

    const [currentWayToGet, setCurrentWayToGet] = useState(1)
    const [selectedCards, setSelectedCards] = useState([])
    const [necessaryInf, setNecessaryInf] = useState("")

    const fetchCards = async () => {
        const response = await globalStore.GetAllCards()
        if(response != undefined){
            console.log(response.cards)
            setCards(response.cards)
        }
    }

    function getInf(){
        if (currentWayToGet === 1){
            setSelectedCards(cards)
        }
        else if(currentWayToGet === 2){
            setSelectedCards(cards.filter(t => t.billId === necessaryInf))
        }
        else if(currentWayToGet === 3){
            setSelectedCards(cards.filter(t => t.cardId === necessaryInf))
        }
    }

    useEffect(() => {

        fetchCards()

    }, [])
    return(
        <>
            <div className="GetCardsMainField">
                <p className="getUsersHeader">Выберите, как хотите получить карты</p>
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
                        {selectedCards.map((card) => {
                            return (
                            <>
                                <div className="receivedUser">
                                    <p>Id: {card.cardId}</p>
                                    <p>Id счета: {card.billId}</p>
                                    <p>Номер карты: {card.cardNumber}</p>
                                    <p>Имя пользователя: {card.userName}</p>
                                </div>
                            </>
                            )
                        })}
                    </div>
            </div>
        </>
    )
}

export default observer(GetCards)