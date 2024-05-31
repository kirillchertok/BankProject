import { observer } from "mobx-react-lite"
import './BanUnBanUserStyle.css'
import { useContext, useState } from "react"
import { Context } from "../../../../main"

function BanUnBanUser(){
    const {globalStore} = useContext(Context)

    const [userId, setUserId] = useState("")
    const [currentWayToGet, setCurrentWayToGet] = useState(2)

    async function banUnBanUser(){
        if(currentWayToGet === 1){
            const response = await globalStore.BanUserByUserId(userId)
            console.log(response)
        }
        else if(currentWayToGet === 2){
            const response = await globalStore.UnBanUserByUserId(userId)
            console.log(response)
        }
    }

    return(
        <>
        <div className="BanUnBanMain">
            <p className="getUsersHeader">Выберите, что хотите сделать</p>
            <div className="selectWayToGet">
                <div className={currentWayToGet === 1 ? "selected" : "notselected"}
                onClick={() => {setCurrentWayToGet(1)}}>
                    <p>Заблокировать</p>
                </div>
                <div className={currentWayToGet === 2 ? "selected" : "notselected"}
                onClick={() => {setCurrentWayToGet(2)}}>
                    <p>Разблокировать</p>
                </div>
            </div>
                <input 
                    type="text"
                    value={userId}
                    className="necessaryInf"
                    placeholder="ID..."
                    onChange={(event) => {
                        setUserId(event.target.value)
                    }} 
                    />
                <button className="accountBtn" id="banBtn" onClick={() => banUnBanUser()}>{currentWayToGet === 1 ? "Заблокировать" : "Разблокировать"}</button>
        </div>
        </>
    )
}

export default observer(BanUnBanUser)