import { observer } from "mobx-react-lite"
import './GetCredistStyles.css'
import { useContext, useEffect, useState } from "react";
import { Context } from "../../../../main";

function GetCredits(){
    const {globalStore} = useContext(Context)

    const [credits, setCredits] = useState(null)

    const [currentWayToGet, setCurrentWayToGet] = useState(1)
    const [selectedCredits, setSelectedCredits] = useState([])
    const [necessaryInf, setNecessaryInf] = useState("")

    const fetchCredits = async () => {
        const response = await globalStore.GetAllCredits()
        if(response != undefined){
            console.log(response.credits)
            setCredits(response.credits)
        }
    }

    function getInf(){
        if (currentWayToGet === 1){
            setSelectedCredits(credits)
        }
        else if(currentWayToGet === 2){
            setSelectedCredits(credits.filter(t => t.billId === necessaryInf))
        }
        else if(currentWayToGet === 3){
            setSelectedCredits(credits.filter(t => t.creditId === necessaryInf))
        }
    }

    useEffect(() => {

        fetchCredits()

    }, [])
    return(
        <>
            <div className="GetCardsMainField">
                <p className="getUsersHeader">Выберите, как хотите получить кредиты</p>
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
                        <p>Один по Id</p>
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
                        {selectedCredits.map((credit) => {
                            return (
                            <>
                                <div className="receivedUser">
                                    <p>Id: {credit.creditId}</p>
                                    <p>Id счета: {credit.billId}</p>
                                    <p>Осталось выплатить: {credit.leftToPay}</p>
                                    <p>Осталось выплатить в этом месяце: {credit.leftToPayThisMonth}</p>
                                    <p>Месяцев на выплату: {credit.monthToPay}</p>
                                    <p>Проценты: {credit.procents}</p>
                                    <p>{credit.endorsement ? "Ободрен" : "На одобрении"}</p>
                                </div>
                            </>
                            )
                        })}
                    </div>
            </div>
        </>
    )
}

export default observer(GetCredits)