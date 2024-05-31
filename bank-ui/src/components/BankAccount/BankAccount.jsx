import { observer } from "mobx-react-lite"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './BankAccount.module.css'
import { useContext, useEffect } from "react"
import { Context } from "../../main"
import { useNavigate } from "react-router-dom"
import UserAccount from "./UserAccount/UserAccount"
import AdminAccount from "./AdminAccount/AdminAccount"
import Loader from "../Loader/Loader"

function BankAccount(){
    const {globalStore} = useContext(Context)

    globalStore.setId(localStorage.getItem('userId'))
    globalStore.setBankAccountId(localStorage.getItem('accountId'))
    
    const navigate = useNavigate()
    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
            <header className={styles.header} >
                <div className={styles.GoHomeButton}>
                    <button className={styles.button} id="leftHeaderIcon" onClick={() => {
                        navigate("/")
                    }}>
                        <FontAwesomeIcon icon="fa-solid fa-building-columns" size="4x"/>
                    </button>
                </div>
                <h1 className={styles.h1}>Bank</h1>
                <div className={styles.LogoutButtons} data-status="1">
                    <button className={styles.button} onClick={async () => {
                        await globalStore.logout(localStorage.getItem('userId'))
                        navigate("/")
                        location.reload()
                        }} id="rightHeaderIcon">
                        <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" size="4x"/>
                    </button>
                </div>
            </header>
            {localStorage.getItem('role') === "" ? "" : (
                localStorage.getItem('role') === "admin" ? (
                    <>
                        <AdminAccount />
                    </>
                ) : (
                    <>
                        <UserAccount />
                    </>
                )
            )}
            <footer>
                <div className={styles.footer}></div>
            </footer>
        </>
    )
}
export default observer(BankAccount)