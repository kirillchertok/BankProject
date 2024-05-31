import { observer } from "mobx-react-lite"
import './AddCreditStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState, useEffect, useRef} from "react"
import { Context } from "../../../../../../main"

function AddCredit({ billData, creditId, setCreditId}){
    const {globalStore} = useContext(Context)

    const billId = billData.id
    const billCurrency = billData.currency

    const Id = creditId

    const rootref = useRef(null)
    const rootrefField = useRef(null)

    const [creditValues, setCreditValues] = useState(null)
    const [maxCreditValue, setMaxCreditValue] = useState(null)
    
    const [creditApplicationInf, setCreditApplicationInf] = useState(null)
    const [maxDateChange, setMaxDateChange] = useState(null)
    const [minDateChange, setMinDateChange] = useState(null)

    const date = new Date()
    date.setDate(date.getDate() + 1)
    const minDate = convertDateToStr(date)
    date.setDate(date.getDate() + 6)
    const maxDate = convertDateToStr(date)

    const casualProcents = new Map()
    casualProcents.set("0", 0).set("6", 30).set("12", 28).set("18", 26).set("24", 24).set("30", 22).set("36", 20).set("42", 18).set("48", 16).set("54", 14).set("60", 12)

    function calculateProcents(monthToPay){
        let casualProcent = 0
        for (var [key, value] of casualProcents) {
            if(key === monthToPay){
                casualProcent = value
            }
        }
        return casualProcent
    }


    useEffect(() => {
        if(Id !== null){
            fetchOneCredit()
        }
        fetchCreditValues()
    }, [])

    useEffect(() => {
        const closeAddCredit = (event) => {
            const {target} = event;
            if(target instanceof Node && rootref.current?.contains(target) && !rootrefField.current?.contains(target)){
                globalStore.setIsOpenAddCredit(false)
                clearAllInf()
            }
        }
        window.addEventListener('click',closeAddCredit)

        return () => {
            window.removeEventListener('click',closeAddCredit)
        }
    }, [globalStore.isOpenAddCredit])

    const [addCreditInf, setAddCreditInf] = useState({
        'dateStart': minDate,
        'monthToPay': "6",
        'amountOfMoney': 0,
        'procents': calculateProcents("6"),
        'salary': 0,
    })

    function clearAllInf(){
        setAddCreditInf({
            'dateStart': minDate,
            'monthToPay': "6",
            'amountOfMoney': 0,
            'procents': calculateProcents("6"),
            'salary': 0,
        })
        setCreditApplicationInf(null)
        setCreditId(null)
    }

    function validateApplication(){
        if(addCreditInf.amountOfMoney === "0"){
            return "Не указано количество средств"
        }
        else if(addCreditInf.salary === "0"){
            return "Не указана зароботная плата"
        }

        return "ok"
    }

    function convertStrtoDatePlus7(str){
        const date = new Date(Date.parse(str))
        date.setDate(date.getDate() + 7)
        return date
    }
    
    function convertStrToDate(str){
        const date = new Date(Date.parse(str))
        return date
    }

    function convertDateToStr(date){
        return (
            date.getFullYear()
            + "-" +
            ((date.getMonth() + 1).toString().length < 2 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString())
            + "-" +
            (date.getDate().toString().length < 2 ? ("0" + date.getDate().toString()) : date.getDate().toString())
        )
    }

    async function tryCredit(){
        if(validateApplication() !== "ok" && creditApplicationInf === null){
            globalStore.setErrorCredit(validateApplication())
        }
        if(creditApplicationInf === null){
            const data = await globalStore.tryGetCredit(localStorage.getItem('userId'), billId, addCreditInf.dateStart, addCreditInf.amountOfMoney, addCreditInf.monthToPay, addCreditInf.salary, addCreditInf.procents)
        }
        else{
            const data = await globalStore.UpdateCreditApplicationInf(Id, creditApplicationInf.dateStart, creditApplicationInf.amountOfMoney, creditApplicationInf.monthToPay, creditApplicationInf.procents)
        }
        location.reload()
    }

    const fetchOneCredit = async () => {
        const response = await globalStore.GetOneCredit(Id)
        if(response !== undefined){
            setCreditApplicationInf({
                'dateStart': response.credit.dateStart,
                'monthToPay': response.credit.monthToPay,
                'amountOfMoney': response.credit.amountOfMoney,
                'procents': calculateProcents(response.credit.monthToPay.toString()),
                'salary': "Нельзя изменить",
            })
            setMaxDateChange(convertDateToStr(convertStrtoDatePlus7(response.credit.dateStart)))
            setMinDateChange(convertDateToStr(convertStrToDate(response.credit.dateStart)))
        }
    } 
    const fetchCreditValues = async () => {
        const response = await globalStore.GetAllCreditValues()
        if(response !== undefined){
            const filtredCV = response.filter(cv => cv.currency === billCurrency)
            setCreditValues(filtredCV)
            setMaxCreditValue(filtredCV.filter(cv => cv.month == (creditApplicationInf === null ? addCreditInf.monthToPay : creditApplicationInf.monthToPay))[0].moneyValue)
        }
    }

    return (
        <>
            <div className="addCreditMainField" ref={rootref}>
                <div className="addCreditMain" ref={rootrefField}>
                    <div className="addcreditHeader">
                        <p>{creditApplicationInf === null ? "Заявка на получение кредита" : "Редактирование заявки"}</p>
                        <div className="goBackBtn" onClick={() => {
                            globalStore.setIsOpenAddCredit(false)
                            clearAllInf()
                        }}>
                            <FontAwesomeIcon icon="fa-solid fa-xmark" />
                        </div>
                    </div>
                    <div className="addCreditInputs">
                        <div className="addCreditField">
                            <label htmlFor="dateCreditInput">Введите дату начала</label>
                            <input 
                                type="date"
                                className="casualInputAddCredit"
                                id="dateCreditinput" 
                                value={creditApplicationInf === null ? addCreditInf.dateStart : creditApplicationInf.dateStart}
                                min={creditApplicationInf === null ? minDate : minDateChange}
                                max={creditApplicationInf === null ? maxDate : maxDateChange}
                                onChange={(event) => {
                                    if(creditApplicationInf === null){
                                        setAddCreditInf((prev) => ({
                                            ...prev, dateStart: event.target.value
                                        }))
                                    }
                                    else{
                                        setCreditApplicationInf((prev) => ({
                                            ...prev, dateStart: event.target.value
                                        }))
                                    }
                                }}
                                />
                        </div>
                        <div className="addCreditField">
                            <label htmlFor="dateCreditInput">Введите количество средств (максимум - {maxCreditValue})</label>
                            <input 
                                type="text"
                                className="casualInputAddCredit"
                                id="amountCreditinput" 
                                placeholder=""
                                value={creditApplicationInf === null ? addCreditInf.amountOfMoney : creditApplicationInf.amountOfMoney}
                                onChange={(event) => {
                                    let value = ""
                                    if(event.target.value.length === 0){
                                        value = "0"
                                    }
                                    else if(event.target.value[0] === "0"){
                                        value = event.target.value.slice(1)
                                    }
                                    else{
                                        value = event.target.value
                                    }
                                    if(creditApplicationInf === null){
                                        setAddCreditInf((prev) => 
                                            ((/\d+/.test(Number((value)[value.length - 1]))) === false ? 
                                            (prev) : 
                                            (Number(value) > Number(maxCreditValue) ? (prev) : ({
                                                ...prev, amountOfMoney: value
                                            }))
                                            ))
                                    }
                                    else{
                                        setCreditApplicationInf((prev) => 
                                            ((/\d+/.test(Number((value)[value.length - 1]))) === false ? 
                                            (prev) : 
                                            (Number(value) > Number(maxCreditValue) ? (prev) : ({
                                                ...prev, amountOfMoney: value
                                            }))
                                            ))
                                    }
                                    }}
                                />
                        </div>
                        <div className="addCreditField">
                            <label htmlFor="dateCreditInput">Желаемый срок - {creditApplicationInf === null ? addCreditInf.monthToPay : creditApplicationInf.monthToPay} месяцев</label>
                            <input 
                                type="range"
                                className="casualInputAddCredit"
                                id="monthCreditinput" 
                                value={creditApplicationInf === null ? addCreditInf.monthToPay : creditApplicationInf.monthToPay}
                                min={6}
                                max={60}
                                step={6}
                                onChange={(event) => {
                                    if(creditApplicationInf === null){
                                        setAddCreditInf((prev) => ({
                                            ...prev, monthToPay: event.target.value, procents: calculateProcents(event.target.value)
                                        }))   
                                    }
                                    else{
                                        setCreditApplicationInf((prev) => ({
                                            ...prev, monthToPay: event.target.value, procents: calculateProcents(event.target.value)
                                        }))
                                    }
                                    const maxValue = creditValues.filter(cv => cv.month == event.target.value)[0].moneyValue
                                    setMaxCreditValue(maxValue)
                                    if(Number(maxValue) < Number((creditApplicationInf === null ? addCreditInf.amountOfMoney : creditApplicationInf.amountOfMoney))){
                                        if(creditApplicationInf !== null){
                                            setCreditApplicationInf((prev) => ({
                                                ...prev, amountOfMoney: maxValue
                                            }))
                                        }
                                        else{
                                            setAddCreditInf((prev) => ({
                                                ...prev, amountOfMoney: maxValue
                                            }))
                                        }
                                    }
                                }}
                                />
                        </div>
                        <div className="addCreditField">
                            <label htmlFor="dateCreditInput">Введите вашу заработную плату (в {billCurrency})</label>
                            <input 
                                type="text"
                                className="casualInputAddCredit"
                                id="salaryCreditinput" 
                                value={creditApplicationInf === null ? addCreditInf.salary : "Нельзя изменить"}
                                onChange={(event) => {
                                    let value = ""
                                    if(event.target.value.length === 0){
                                        value = "0"
                                    }
                                    else if(event.target.value[0] === "0"){
                                        value = event.target.value.slice(1)
                                    }
                                    else{
                                        value = event.target.value
                                    }
                                    if(creditApplicationInf === null){
                                        setAddCreditInf((prev) => 
                                            ((/\d+/.test(Number((value)[value.length - 1]))) === false ? 
                                            (prev) : 
                                            ({
                                                ...prev, salary: value
                                            })
                                            ))   
                                    }
                                    }}
                                />
                        </div>
                        <p>Процент годовых - {creditApplicationInf === null ? addCreditInf.procents : creditApplicationInf.procents}</p>
                        <button
                            className="accountBtn"
                            id="calculateCredit"
                            onClick={() => {
                                tryCredit()
                            }}
                            >
                            {creditApplicationInf === null ? "Подать" : "Редактировать"} заявку
                        </button>
                        <p>{globalStore.errorCredit}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default observer(AddCredit)