import { observer } from "mobx-react-lite"
import './AccountStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import BillInf from "./BillInf/BillInf"
import { Context } from "../../../../../main"
import DistributeMoney from "./BillInf/DistributeMoney/DistributeMoney"
import AddBillField from "./AddBillField/AddBillField"
import Loader from "../../../../Loader/Loader"

function Account(){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    const [bills, setBills] = useState(null)
    const [fullName, setFullName] = useState("")
    const [allAccountMoney, setAllAccountMoney] = useState(0)

    useEffect(() => {
        const fetchBillsData = async () => {
            const response = await globalStore.GetAllAccountData((localStorage.getItem('accountId') === null ? "" : localStorage.getItem('accountId')))
            if(response?.billsData.length !== 0){
                setBills(response.billsData);
                let allMoney = 0
                response.billsData.map(billData => {
                    allMoney += (billData.bill.amountOfMoney + billData.bill.amountOfMoneyUnAllocated)
                })
                setAllAccountMoney(allMoney)
            }
        }
        
        fetchBillsData();

    },[])

    useEffect(() => {
        const fetchFullName = async () => {
            const response = await globalStore.GetFullUserName((localStorage.getItem('userId') === null ? "" : localStorage.getItem('userId')))
            if(response){
                setFullName(firstToUpper(response.name) + " " + firstToUpper(response.secondname))
            }
        }

        fetchFullName();

    },[])

    function firstToUpper(str){
        let firstChar = str.charAt(0).toUpperCase()
        let resOfString = str.slice(1)

        return firstChar + resOfString
    }
    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
        <div className="accountMain">
            {globalStore.isOpenAddBill && (
                <>
                    <AddBillField />
                </>
            )}
            {globalStore.isOpenDistributeMoney && (
                <>
                    <DistributeMoney billData={globalStore.billToDistribute}/>
                </>
            )}
            <div className="accountMainField">
                <div className="accountHeader">
                    <h2>Ваш аккаунт</h2>
                    <div className="goBackButton" onClick={() => {
                            globalStore.setWasOperationBefore(false)
                            navigate('/account')
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </div>
                </div>
                <div className="accountInfField">
                    <div className="userInf">
                        <div className="userInfIcon">
                            <FontAwesomeIcon icon="fa-solid fa-user"/>
                        </div>
                        <div className="userInfText">
                            <span>{fullName === "" ? "Загрузка..." : fullName}</span>
                        </div>
                    </div>
                    <span className="allMoneyInf">Общее количество средств: <strong>{allAccountMoney}</strong>
                    </span>
                    {bills === null ? (
                        <>
                            <h1>У вас пока нет счетов</h1>
                        </>
                    ) : (
                        <>
                            {bills.map((billData, index) => {
                                return(
                                    <>
                                        <BillInf billData={billData} key={index}/>
                                    </>
                                )
                            })}
                        </>
                    )}
                    <button 
                        className="accountBtn" 
                        id="addBillBtn"
                        onClick={() => {
                            globalStore.setWasOperationBefore(false)
                            globalStore.setIsOpenAddBill(true)
                        }}
                        data-status={globalStore.wasOperationBefore}
                        >Добавить счет</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default observer(Account)