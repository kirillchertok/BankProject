import { observer } from "mobx-react-lite"
import './UserBannedStyles.css'
import { useContext, useEffect, useRef } from "react"
import { Context } from "../../../main"

function UserBanned(){
    const {globalStore} = useContext(Context)

    const rootref = useRef()

    useEffect(() => {
        const handleClick = (event) => {
            const {target} = event;
            if(target instanceof Node && !rootref.current?.contains(target)){
                globalStore.setIsOpenUserBanned(false)
                globalStore.setErrorUnbanMessage("")
            }
        }
        window.addEventListener('click',handleClick)

        return () => {
            window.removeEventListener('click',handleClick)
        }
    },[globalStore.isOpenUserBanned])

    return(
        <>
        <div className="userBannedMain">
            <div className="userBannedMainField" ref={rootref}>
                <p className="mainMessage">Вы заблокированы</p>
                <p>{globalStore.errorUnbanMessage}</p>
                <button 
                    className="accountBtn" 
                    id="bannedBtn"
                    onClick={() => {
                        globalStore.SendUnbanUserMessage(localStorage.getItem('userId'))
                    }}
                    >Подать апеляция</button>
            </div>
        </div>
        </>
    )
}

export default observer(UserBanned);