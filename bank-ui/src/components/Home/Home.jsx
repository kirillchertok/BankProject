import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import styles from './Home.module.css'
import './Home.module.css'
import SelectServicesHome from "./SelectServicesHome/SelectServicesHome"
import Exchange from "./Exchange/Exchange"
import Auth from "./Auth/Auth"
import { useContext, useEffect } from "react"
import { Context } from "../../main"
import { observer } from "mobx-react-lite"
import { useNavigate } from "react-router-dom"
import UserBanned from "./UserBanned/UserBanned"
import Loader from "../Loader/Loader"

function Home(){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('token')){
            globalStore.checkAuth()
        }
    },[])

    return (
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
        <header className={styles.header} >
            <div className={styles.GoHomeButton}>
                <button className={styles.button} id="leftHeaderIcon">
                    <FontAwesomeIcon icon="fa-solid fa-building-columns" size="4x"/>
                </button>
            </div>
            <h1 className={styles.h1}>Bank</h1>
            {localStorage.getItem('userId') ? (
                <>
                <div className={styles.LogoutButtons} data-status="2">
                    <button className={styles.button} onClick={() => {navigate("/account")}}>
                        <FontAwesomeIcon icon="fa-solid fa-user" size="4x"/>
                    </button> 
                    <button className={styles.button} onClick={ async () => { 
                        await globalStore.logout(localStorage.getItem('userId'))
                        location.reload()
                        }} id="rightHeaderIcon">
                        <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" size="4x"/>
                    </button>
                </div>
                </>
            ) : (
                <>
                <div className={styles.LogoutButtons} data-status="1">
                    <button className={styles.button} onClick={() => {globalStore.setIsOpenLogin(true)}} id="rightHeaderIcon">
                        <FontAwesomeIcon icon="fa-solid fa-right-to-bracket" size="4x"/>
                    </button>  
                </div>
                </>
            )}
        </header>

        <SelectServicesHome />
        <Exchange />

        {globalStore.isOpenLogin && <Auth/>}
        {globalStore.isOpenUserBanned && <UserBanned />}

        <footer>
            <div className={styles.footer}></div>
        </footer>

        </>
    )
}

export default observer(Home);