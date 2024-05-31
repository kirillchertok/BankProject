import { observer } from "mobx-react-lite"
import './ChangeBalanceStyles.css'
import { useContext, useState } from "react"
import { Context } from "../../../../main"

function ChangeBalance(){
    const {globalStore} = useContext(Context)

    const [currentType, setCurrentType] = useState(1)
    const [currentMoneyType, setCurrentMoneyType] = useState(1)
    const [billId, setBillId] = useState("")
    const [amountOfMoney, setAmountOfMoney] = useState("")

    async function changeBalance(){
        if(currentType === 1){
            if(currentMoneyType === 1){
                await globalStore.AddMoney(billId, amountOfMoney)
            }
            else{
                await globalStore.AddMoneyUnAllocated(billId, amountOfMoney)
            }
        }
        else if(currentType === 2){
            if(currentMoneyType === 1){
                await globalStore.RemoveMoney(billId, amountOfMoney)
            }
            else{
                await globalStore.RemoveMoneyUnAllocated(billId, amountOfMoney)
            }
        }
    }

    return(
        <>
            <div className="changeBalanceMain">
                <p className="getUsersHeader">Выберите, что хотите сделать</p>
                <div className="selectWayToGet">
                <div className={currentType === 1 ? "selected" : "notselected"}
                    onClick={() => {setCurrentType(1)}}>
                        <p>Добавить</p>
                    </div>
                <div className={currentType === 2 ? "selected" : "notselected"}
                    onClick={() => {setCurrentType(2)}}>
                        <p>Отнять</p>
                    </div>
                </div>
                <div className="selectWayToGet">
                    <div className={currentMoneyType === 1 ? "selected" : "notselected"}
                    onClick={() => {setCurrentMoneyType(1)}}>
                        <p>Распределенные средства</p>
                    </div>
                    <div className={currentMoneyType === 2 ? "selected" : "notselected"}
                    onClick={() => {setCurrentMoneyType(2)}}>
                        <p>Нераспределенные средства</p>
                    </div>
                </div>
                <input 
                    type="text"
                    value={billId}
                    className="necessaryInf"
                    placeholder="ID счета..."
                    onChange={(event) => {
                        setBillId(event.target.value)
                    }} 
                    />
                <input 
                    type="text"
                    value={amountOfMoney}
                    className="necessaryInf"
                    placeholder="Сумма..."
                    onChange={(event) => {
                        setAmountOfMoney(event.target.value)
                    }} 
                    />
                <button className="accountBtn" id="banBtn" onClick={() => {changeBalance()}}>Подтвердить</button>
            </div>
        </>
    )
}

export default observer(ChangeBalance)