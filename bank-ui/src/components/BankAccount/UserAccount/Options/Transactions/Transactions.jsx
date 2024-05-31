import { observer } from "mobx-react-lite"
import './TransactionsStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Context } from '../../../../../main'
import { useNavigate } from "react-router-dom"
import SortTransactions from "../../../../../services/TransactionsSortService"
import Loader from "../../../../Loader/Loader"

function Transactions(){
    const {globalStore} = useContext(Context)

    const navigate = useNavigate()

    const [update, updatePage] = useState(false)

    const [transactionsAll, setTransactionsAll] = useState(null)
    const [transactionsSorted, setTransactionsSorted] = useState(null)
    const [billsNumbers, setBillsNumbers] = useState(null)

    const [needToSort, setNeedToSort] = useState(false)
    const [sortFieldsError, setSortFiledsError] = useState("")
    const [selectedDataSortOrder, setSelectedDataSortOrder] = useState("DateLast")
    const [selectedDataSortType, setSelectedDataSortType] = useState("")
    const [selectedDataSort, setSelectedDataSort] = useState("")
    const [extraSelectedDataSort, setExtraSelectedDataSort] = useState("")
    const [sortData, setSortData] = useState("")
    const [extraSortData, setExtraSortdata] = useState("")

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await globalStore.getAllAccountTransactions(localStorage.getItem('accountId'))
            if(response !== null){
                setTransactionsAll(response.transactions)
                setTransactionsSorted(SortTransactions.sort(response.transactions, selectedDataSortOrder, selectedDataSortType, selectedDataSort, extraSelectedDataSort, sortData.replace(/\s+/g, ''), extraSortData.replace(/\s+/g, '')))
                setBillsNumbers(localStorage.getItem('billsNumbers').split(','))
            }
        }

        fetchTransactions()

    }, [])


    function resetSort(){
        setSelectedDataSortOrder("DateLast")
        setSelectedDataSortType("")
        setSelectedDataSort("")
        setExtraSelectedDataSort("")
        setSortData("")
        setExtraSortdata("")
        setTransactionsSorted(transactionsAll)
    }

    const parseString = (date) => {
        const dateTmp = new Date(date)
        const str = (
            dateTmp.getFullYear()
            + "-" +
            ((dateTmp.getMonth() + 1).toString().length < 2 ? ("0" + (dateTmp.getMonth() + 1).toString()) : (dateTmp.getMonth() + 1).toString())
            + "-" +
            (dateTmp.getDate().toString().length < 2 ? ("0" + dateTmp.getDate().toString()) : dateTmp.getDate().toString())
        )
        const tmpStr = str.replace(/-/g,'.')
        return (tmpStr.slice(8) + "." + tmpStr.slice(5,7) + "." + tmpStr.slice(0, 4))
    }

    function convertCardNumber(str){
        return str.slice(0,4)+ " " + str.slice(4,8) + " " + str.slice(8,12) + " " + str.slice(12,16)
    }

    function validateSortFields(){
        if(selectedDataSortType !== ""){
            if(selectedDataSortType === "Sender/Receiver"){
                if(selectedDataSort === "" || extraSelectedDataSort === ""){
                    return "Не указан тип данных"
                }
                else{
                    if(sortData === "" || extraSortData === ""){
                        return "Не указано значение"
                    }
                }
            }
            else{
                if(selectedDataSort === ""){
                    return "Не указан тип данных"
                }
                else{
                    if(sortData === ""){
                        return "Не указано значение"
                    }
                }
            }
        }

        return ""
    }

    function sortTransactions(){
        const check = validateSortFields()
        setSortFiledsError(check)
        if(check === ""){{
            setTransactionsSorted(SortTransactions.sort(transactionsAll, selectedDataSortOrder, selectedDataSortType, selectedDataSort, extraSelectedDataSort, sortData.replace(/\s+/g, ''), extraSortData.replace(/\s+/g, '')))
            updatePage((prev) => !prev)
        }}
    }

    return(
        <>
        {globalStore.isFetching && (
                <>
                    <Loader />
                </>
        )}
            <div className="transactionsMainField">
                <div className="transactionsMain">
                    <div className="transactionsHeader">
                        <p>Ваши переводы</p>
                        <div 
                            className="goBackBtnTrs"
                            onClick={() => {
                                navigate('/account')
                            }}>
                            <FontAwesomeIcon icon="fa-solid fa-right-from-bracket" />
                        </div>
                    </div>
                    <div className="sort">
                        <button 
                            className="accountBtn"
                            id="transactionsSortButton"
                            onClick={() => {
                                setNeedToSort((prev) => !prev)
                                resetSort()
                            }}
                            >
                            {needToSort ? "Не сортировать" : "Сортировать"}
                        </button>
                        {needToSort && (
                            <>
                                <div className="sortType">
                                    <div className="sortHeader">
                                        <p>Выберите тип сортировки</p>
                                        <div 
                                            className="resetSortTypeBtn"
                                            onClick={() => {
                                                resetSort()
                                            }}
                                            >
                                            <FontAwesomeIcon icon="fa-solid fa-rotate-right" />
                                        </div>
                                    </div>
                                    <div className="dataTypeSort">
                                        <div className="chooseType">
                                            <p>Порядок: </p>
                                        </div>        
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortOrder === "DateLast" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortOrder("DateLast")
                                            }}
                                            >
                                            <p>Дата(от последней)</p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortOrder === "DateFirst" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortOrder("DateFirst")
                                            }}
                                            >
                                            <p>Дата(от первой)</p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortOrder === "SumToBig" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortOrder("SumToBig")
                                            }}
                                            >
                                            <p>Сумма(по возрастанию)</p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortOrder === "SumToSmall" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortOrder("SumToSmall")
                                            }}
                                            >
                                            <p>Сумма(по убыванию)</p>
                                        </div>
                                    </div>
                                    <div className="dataTypeSort">
                                        <div className="chooseType">
                                            <p>По данным: </p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortType === "Receiver" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortType((prev) => {
                                                    return (prev === "Receiver" ? "" : "Receiver")
                                                })
                                                setSelectedDataSort("")
                                                setExtraSelectedDataSort("Text")
                                                setSortData("")
                                                setExtraSortdata("")
                                            }}
                                            >
                                            <p>Получателя</p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortType === "Sender" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortType((prev) => {
                                                    return (prev === "Sender" ? "" : "Sender")
                                                })
                                                setSelectedDataSort("")
                                                setExtraSelectedDataSort("Text")
                                                setSortData("")
                                                setExtraSortdata("")
                                            }}
                                            >
                                            <p>Отправителя</p>
                                        </div>
                                        <div 
                                            className="sortTypeOption"
                                            data-status={selectedDataSortType === "Sender/Receiver" ? "selected" : "notSelected"}
                                            onClick={() => {
                                                setSelectedDataSortType((prev) => {
                                                    return (prev === "Sender/Receiver" ? "" : "Sender/Receiver")
                                                })
                                                setSelectedDataSort("")
                                                setExtraSelectedDataSort("")
                                                setSortData("")
                                                setExtraSortdata("")
                                            }}
                                            >
                                            <p>Отправителя/Получателя</p>
                                        </div>
                                    </div>
                                    {selectedDataSortType !== "" && (
                                        <>
                                            <div className="dataTypeSort">
                                                <div className="chooseType">
                                                    <p>Тип данных: </p>
                                                </div>
                                                {(selectedDataSortType === "Sender" || selectedDataSortType === "Receiver") ? (
                                                    <>
                                                        <div 
                                                            className="sortTypeOption"
                                                            data-status={selectedDataSort === "Card" ? "selected" : "notSelected"}
                                                            onClick={() => {
                                                                setSelectedDataSort("Card")
                                                                setSortData("")
                                                                setExtraSortdata("")
                                                            }}
                                                        >
                                                            <p>Номер карты {selectedDataSortType === "Sender" ? "отправителя" : "получателя"}</p>
                                                        </div>
                                                        <div 
                                                            className="sortTypeOption"
                                                            data-status={selectedDataSort === "Bill" ? "selected" : "notSelected"}
                                                            onClick={() => {
                                                                setSelectedDataSort("Bill")
                                                                setSortData("")
                                                                setExtraSortdata("")
                                                            }}
                                                        >
                                                        <p>Номер счета {selectedDataSortType === "Sender" ? "отправителя" : "получателя"}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="senderReceiverInfSort">
                                                            <div 
                                                                className="sortTypeOption"
                                                                data-status={selectedDataSort === "Card" ? "selected" : "notSelected"}
                                                                onClick={() => {
                                                                    setSelectedDataSort("Card")
                                                                    setSortData("")
                                                                }}
                                                            >
                                                                <p>Номер карты отправителя</p>
                                                            </div>
                                                            <div 
                                                                className="sortTypeOption"
                                                                data-status={selectedDataSort === "Bill" ? "selected" : "notSelected"}
                                                                onClick={() => {
                                                                    setSelectedDataSort("Bill")
                                                                    setSortData("")
                                                                }}
                                                            >
                                                                <p>Номер счета отправителя</p>
                                                            </div>
                                                        </div>
                                                        <div className="senderReceiverInfSort">
                                                            <div 
                                                                className="sortTypeOption"
                                                                data-status={extraSelectedDataSort === "Card" ? "selected" : "notSelected"}
                                                                onClick={() => {
                                                                    setExtraSelectedDataSort("Card")
                                                                    setExtraSortdata("")
                                                                }}
                                                            >
                                                                <p>Номер карты получателя</p>
                                                            </div>
                                                            <div 
                                                                className="sortTypeOption"
                                                                data-status={extraSelectedDataSort === "Bill" ? "selected" : "notSelected"}
                                                                onClick={() => {
                                                                    setExtraSelectedDataSort("Bill")
                                                                    setExtraSortdata("")
                                                                }}
                                                            >
                                                                <p>Номер счета получателя</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    {(selectedDataSort !== "" && extraSelectedDataSort !== "") && (
                                        <>
                                            <input 
                                                type="text"
                                                className="transactionsSortInput"
                                                value={sortData}
                                                onChange={(event) => {
                                                    setSortData((prev) => {
                                                        return (event.target.value.length > 20 ? prev : event.target.value)
                                                    })
                                                }}
                                                placeholder=
                                                    {"Введите номер " + 
                                                    (selectedDataSort === "Card" ? "карты " : "банковского счета ") +
                                                    ((selectedDataSortType === "Sender" || selectedDataSortType === "Receiver") ? (
                                                        selectedDataSortType === "Receiver" ? "получателя" : "отправителя"
                                                    ) : (
                                                        "получателя"
                                                    )) 
                                                    + "..."} 
                                                />
                                            {selectedDataSortType === "Sender/Receiver" && (
                                                <>
                                                    <input 
                                                        type="text"
                                                        id="transactionsSortInputSenderInf"
                                                        className="transactionsSortInput"
                                                        value={extraSortData}
                                                        onChange={(event) => {
                                                            setExtraSortdata((prev) => {
                                                                return (event.target.value.length > 20 ? prev : event.target.value)
                                                            })
                                                        }}
                                                        placeholder={"Введите номер " + (extraSelectedDataSort === "Card" ? "карты отправителя" : "банковского счета отправителя") + "..."} 
                                                    />
                                                </>
                                            )}    
                                        </>
                                    )}
                                    <div className="sortFotter">
                                        <button 
                                            className="accountBtn"
                                            id="submitSortBtn"
                                            onClick={() => {
                                                sortTransactions()
                                            }}
                                        >Подтвердить</button>
                                        <p>{sortFieldsError}</p>        
                                    </div>                                    
                                </div>
                            </>
                        )}
                    </div>
                    <div 
                        className="transactions"
                        data-status={transactionsSorted}>
                        {transactionsSorted === null ? (
                            <>
                                <p>Транзакции не найдены</p>
                            </>
                        ) : (
                            <>
                                {transactionsSorted.map((transaction, index) => {
                                    return(
                                        <>
                                            <div 
                                                className="transaction"
                                                data-status={billsNumbers.includes(transaction.senderBillNumber) ? "Sended" : "Received"}
                                                key={index}
                                                >
                                                <div className="trsIcon">
                                                {billsNumbers.includes(transaction.senderBillNumber) ? (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-arrow-trend-down" />
                                                    </>
                                                ) : (
                                                    <>
                                                        <FontAwesomeIcon icon="fa-solid fa-money-bills" />
                                                    </>
                                                )}
                                                </div>
                                                <div className="trsInf">
                                                    <p className="trsInfTypeText">Отправитель:</p>
                                                    <p className="trsInfTypeText">Получатель:</p>
                                                    <div className="trsDate">
                                                        <FontAwesomeIcon icon="fa-solid fa-calendar" />
                                                        <p className="dateStr">{parseString(transaction.date)}</p>
                                                    </div>
                                                    <div className="senderReceiverInf">
                                                        <p>Номер карты: {transaction.senderCard === "" ? "Не указан" : convertCardNumber(transaction.senderCard)}</p>
                                                        <p>Номер счета: {transaction.senderBillNumber}</p>
                                                    </div>
                                                    <div className="senderReceiverInf">
                                                        <p>Номер карты: {transaction.receiverCard === "" ? "Не указан" : convertCardNumber(transaction.receiverCard)}</p>
                                                        <p>Номер счета: {transaction.receiverBillNumber}</p>
                                                    </div>
                                                </div>
                                                <div className="amountOfMoneyTrs">
                                                    <span className="amountOfMoneyTrsText">{transaction.amountOfMoney}</span>
                                                </div>
                                            </div>
                                        </>
                                    )
                                })}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default observer(Transactions)