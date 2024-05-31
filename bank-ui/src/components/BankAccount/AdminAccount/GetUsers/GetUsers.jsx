import { observer } from "mobx-react-lite"
import './GetUsersStyles.css'
import { useContext, useState } from "react"
import { Context } from "../../../../main"

function GetUsers(){
    const {globalStore} = useContext(Context)

    const [currentWayToGet, setCurrentWayToGet] = useState(1)
    const [necessaryInf, setNecessaryInf] = useState("")
    const [users, setUsers] = useState(null)
    const [accounts, setAccounts] = useState(null)

    async function getInf(){
        if(currentWayToGet === 1){
            const response = await globalStore.getAllUsers()
            setUsers(response)
        }
        else if(currentWayToGet === 2){
            const response = await globalStore.getAllAccounts()
            setAccounts(response)
        }
        else if(currentWayToGet === 3){
            const response = await globalStore.getOneUser(necessaryInf)
            setUsers(response)
        }
        else if(currentWayToGet === 4){
            const response = await globalStore.getOneAccount(necessaryInf)
            setAccounts(response)
        }
    }

    const ClearAllData = () => {
        setNecessaryInf("")
        setAccounts(null)
        setUsers(null)
    }
    return(
        <>
        <div className="getUsersMain">
            <p className="getUsersHeader">Выберите, как вы хотите получить данные пользователей</p>
            <div className="selectWayToGet">
                <div className={currentWayToGet === 1 ? "selected" : "notselected"}
                onClick={() => {ClearAllData() ; setCurrentWayToGet(1)}}>
                    <p>Все пользователи</p>
                </div>
                <div className={currentWayToGet === 2 ? "selected" : "notselected"}
                onClick={() => {ClearAllData() ; setCurrentWayToGet(2)}}>
                    <p>Все аккаунты</p>
                </div>
                <div className={currentWayToGet === 3 ? "selected" : "notselected"}
                onClick={() => {ClearAllData() ; setCurrentWayToGet(3)}}>
                    <p>Пользователь по ID</p>
                </div>
                <div className={currentWayToGet === 4 ? "selected" : "notselected"}
                onClick={() => {ClearAllData() ; setCurrentWayToGet(4)}}>
                    <p>Аккаунт по ID</p>
                </div>
            </div>
            <div className="requestInfDiv">
                <button className="submitRequest" onClick={() => getInf()}>Получить данные</button>
                <input 
                    type="text"
                    className="necessaryInf"
                    value={necessaryInf}
                    placeholder={currentWayToGet === 3 ? "ID пользователя..." : "ID акканута..."}
                    style={{opacity: (currentWayToGet === 3 || currentWayToGet === 4) ? '1' : '0' }}
                    onChange={(event) => {
                        setNecessaryInf(event.target.value)
                    }}     
                />
            </div>
            <div className="receivedInf">
                {users === null ? "" : (
                    <>
                        {Array.isArray(users) ? (
                            <>
                                {users.map((user) => {
                                if(user.role !== "admin"){
                                    return(
                                        <>
                                            <div className="receivedUser">
                                                <p>Id : {user.id}</p>
                                                <p>ФИО : {user.name} {user.secondname}</p>
                                                <p>Дата рождения : {user.birthdayDate}</p>
                                                <p>Номер телефона : {user.phoneNumber}</p>
                                                <p>Почта : {user.email}</p>
                                                <p>Номер паспотра : {user.passportNumber}</p>
                                            </div>
                                        </>
                                    )
                                }
                                else{
                                    return ""
                                }
                                })}
                            </>
                        ) : (
                            <>
                                <div className="receivedUser">
                                    <p>Id : {users.id}</p>
                                    <p>ФИО : {users.name} {users.secondname}</p>
                                    <p>Дата рождения : {users.birthdayDate}</p>
                                    <p>Номер телефона : {users.phoneNumber}</p>
                                    <p>Почта : {users.email}</p>
                                    <p>Номер паспотра : {users.passportNumber}</p>
                                </div>
                            </>
                        )}
                    </>
                )}
                {accounts === null ? "" : (
                    <>
                        {Array.isArray(accounts) ? (
                            <>
                                {accounts.map((account) => {
                                return(
                                    <>
                                        <div className="receivedUser">
                                            <p>Id : {account.bankAccountId}</p>
                                            <p>Заблокирован : {account.isBanned === true ? "Да" : "Нет"}</p>
                                            <p>Id пользователя : {account.userId}</p>
                                        </div>
                                    </>
                                )
                                })}
                            </>
                        ) : (
                            <>
                                <div className="receivedUser">
                                    <p>Id : {accounts.bankAccountId}</p>
                                    <p>Заблокирован : {accounts.isBanned === true ? "Да" : "Нет"}</p>
                                    <p>Id пользователя : {accounts.userId}</p>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
        </>
    )
}

export default observer(GetUsers)