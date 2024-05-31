import { observer } from "mobx-react-lite"
import './UserAccountStyles.css'
import Options from "./Options/Options"
import AccountInf from "./AccountInf/AccountInf"
import Expenses from "./Expenses/Expenses"
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../main"
import { useNavigate } from "react-router-dom"

function UserAccount(){
    const {globalStore} = useContext(Context);

    const navigate = useNavigate()

    /* useEffect(() => {
        const checkban = async () => {
            const response = await globalStore.CheckisUserBanned(localStorage.getItem('userId'))
            return response
        }

        var status = checkban()

        if(status){
            globalStore.logout(localStorage.getItem('userId'))
            globalStore.setIsOpenUserBanned(true)
            console.log(status)
            navigate("/")
        }
    }, []) */

    const [updateExpenses, setUpdateExpenses] = useState(true)

    return(
        <>
            <div className="Main">
                <div className="Fields">
                    <Options />
                    <AccountInf updateExp={updateExpenses} setUpdateExp={setUpdateExpenses}/>
                    <Expenses updateExp={updateExpenses} setUpdateExp={setUpdateExpenses}/>
                </div>
            </div>
        </>
    )
}
export default observer(UserAccount)