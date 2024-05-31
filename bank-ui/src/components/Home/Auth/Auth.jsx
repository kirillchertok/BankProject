import { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './AuthStyles.css'
import { Context } from '../../../main'
import { observer } from 'mobx-react-lite'
import { redirect, useNavigate } from 'react-router-dom'

function Auth(){
    const {globalStore} = useContext(Context)

    function validateRegisration(){
        const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        if(
            dataCheckIn.name === "" ||
            dataCheckIn.secondname === "" ||
            dataCheckIn.phoneNumber === "" ||
            dataCheckIn.email === "" ||
            dataCheckIn.passportNumber === "" ||
            dataCheckIn.passportId === "" ||
            dataCheckIn.password === ""
        )
        {
            globalStore.setErrorAuth("Не все поля заполнены")
            return false
        }
        if(dataCheckIn.phoneNumber.length !== 14){
            globalStore.setErrorAuth("Некорректый номер телефона")
            return false;
        }
        if(!EMAIL_REGEXP.test(dataCheckIn.email)){
            globalStore.setErrorAuth("Некорректная почта")
            return false;
        }
        if(dataCheckIn.passportNumber.length !== 9){
            globalStore.setErrorAuth("Некорректный номер паспорта")
            return false
        }
        if(dataCheckIn.passportId.length !== 14){
            globalStore.setErrorAuth("Некорректный идентификационный номер")
            return false
        }
        if(dataCheckIn.password != checkPassword){
            globalStore.setErrorAuth("Пароли не совпадают")
            return false
        }
        globalStore.setErrorAuth("")
        return true
    }

    function validateLogin(){
        if(dataLogIn.phoneNumber === "" || dataLogIn.password === ""){
            globalStore.setErrorAuth("Не все поля заполнены");
            return false;
        }
        if(dataLogIn.phoneNumber.length !== 14){
            globalStore.setErrorAuth("Некорректый номер телефона")
            return false;
        }
        globalStore.setErrorAuth("")
        return true
    }

    function registration(){
        if(validateRegisration()){
            globalStore.registration(
                dataCheckIn.name, 
                dataCheckIn.secondname, 
                dataCheckIn.phoneNumber, 
                dataCheckIn.email,
                dataCheckIn.tfAuth,
                dataCheckIn.role,
                dataCheckIn.passportNumber,
                dataCheckIn.birthdayDate,
                dataCheckIn.passportId,
                dataCheckIn.password)
        }                          
    }

    function login(){
        if(validateLogin()){
            /* globalStore.login(dataLogIn.phoneNumber,dataLogIn.password) */
            globalStore.sendEmail(dataLogIn.phoneNumber, dataLogIn.password)
        }
    }

    const date = new Date()
    date.setFullYear(date.getFullYear() - 18);
    const maxDate = (
        date.getFullYear()
        + "-" +
        ((date.getMonth() + 1).toString().length < 2 ? ("0" + (date.getMonth() + 1).toString()) : (date.getMonth() + 1).toString())
        + "-" +
        (date.getDate().toString().length < 2 ? ("0" + date.getDate().toString()) : date.getDate().toString())
    )

    const [currentOption , setCurrentOption] = useState("login")
    const [confirmEmail, setConfirmEmail] = useState(false)
    const [tfauth , setTfAuth] = useState(false)
    const [code , SetCode] = useState('')
    const [seePassword,setSeePassword] = useState(false)
    const [seePasswordCheckIn ,setSeePasswordCheckIn] = useState(false)
    const [seePasswordCheckInAgain ,setSeePasswordCheckInAgain] = useState(false)
    const [checkPassword , setCheckPassword] = useState("")
    const [dataLogIn,setDataLogIn] = useState({
        phoneNumber:"",
        password:""
    })
    const [dataCheckIn,setDataCheckIn] = useState({
        name: "",
        secondname: "",
        phoneNumber: "",
        email: "",
        tfAuth: tfauth,
        role: "user",
        passportNumber: "",
        birthdayDate: maxDate,
        passportId: "",
        password: ""
    })
    const [code1, setCode1] = useState("")
    const [code2, setCode2] = useState("")
    const [code3, setCode3] = useState("")
    const [code4, setCode4] = useState("")
    const [code5, setCode5] = useState("")

    const rootref = useRef(null)
    const rootrefForm = useRef(null)
    
    const navigate = useNavigate()

    useEffect(() => {
        const handleClick = (event) => {
            const {target} = event;
            if(target instanceof Node && rootref.current?.contains(target) && !rootrefForm.current?.contains(target)){
                globalStore.setIsOpenLogin(false)
                clearAllData()
            }
        }
        window.addEventListener('click',handleClick)

        return () => {
            window.removeEventListener('click',handleClick)
        }
    },[globalStore.isOpenLogin])

    useEffect(() => {
        async function trueLogin(){
            clearAllData()
            const response = await globalStore.login(localStorage.getItem('phoneNumber'), localStorage.getItem('password'))
            localStorage.removeItem('phoneNumber')
            localStorage.removeItem('password')
            globalStore.setIsOpenLogin(false)
            if(response != undefined){
                navigate("/account")
            }
        }
        if(globalStore.code !== ""){
            console.log(globalStore.code)
            if(globalStore.code === "Не нужно"){
                trueLogin()
            }
            else{
                SetCode(globalStore.code)
                setCurrentOption("email")
                setConfirmEmail(true)
            }
        }
    },[globalStore.code])

    const clearAllData = () => {
        setCurrentOption("login")
        setSeePassword(false)
        setSeePasswordCheckIn(false)
        setSeePasswordCheckInAgain(false)
        setCheckPassword("")
        setTfAuth(false)
        setDataLogIn({
            phoneNumber:'',
            password:''
        })
        setDataCheckIn({
            phoneNumber: '',
            name: '',
            secondname: '',
            email: '',
            passportNumber: '',
            birthdayDate: '',
            passportId: '',
            role: 'user',
            tfAuth: false,
            password: ''
        })
        globalStore.setErrorAuth("")
        SetCode("")
        setCode1("")
        setCode2("")
        setCode3("")
        setCode4("")
        setCode5("")
    }
    const clearLogInData = () => {
        setSeePassword(false)
        setDataLogIn({
            phoneNumber:'',
            password:''
        })
        globalStore.setErrorAuth("")
    }
    const clearCheckInData = () => {
        setSeePasswordCheckIn(false)
        setSeePasswordCheckInAgain(false)
        setCheckPassword("")
        setTfAuth(false)
        setDataCheckIn({
            name: '',
            secondname: '',
            phoneNumber: '',
            email: '',
            tfAuth: false,
            role: 'user',
            passportNumber: '',
            birthdayDate: '',
            passportId: '',
            password: ''
        })
        globalStore.setErrorAuth("")
    }

    const convertPhoneNumber = (phone) => {
        if(!Number(phone[phone.length - 1]) && phone[phone.length - 1] !== "0"){
            return phone.slice(0, phone.length - 1)
        }
        if(phone.length === 1){
            return "(" + phone
        }
        else if(phone.length === 3){
            return phone + ") "
        }
        else if(phone.length === 8 || phone.length === 11){
            return phone + "-"
        }
        else if(phone.length >= 14){
            return phone
        }
        else{
            return phone
        }
    }
    const convertPassportNumber = (number) => {
        if(number.length <= 2){
            if(Number(number[number.length - 1])){
                return number.slice(0, number.length - 1)
            }
            else{
                return number.toUpperCase()
            }
        }
        else if(number.length >= 3 && number.length <= 9){
            if(!Number(number[number.length - 1]) && number[number.length - 1] !== "0"){
                return number.slice(0, number.length - 1)
            }
            else{
                return number
            }
        }
        return number.slice(0, number.length - 1)
    }
    const convertPassportIdNumber = (number) => {
        if(number.length > 14){
            return number.slice(0,number.length - 1)
        }
        else{
            if(number.length === 8 || number.length === 12 || number.length === 13){
                if(Number(number[number.length - 1])){
                    return number.slice(0, number.length - 1)
                }
                else{
                    return number.toUpperCase()
                }
            }
            else{
                if(!Number(number[number.length - 1]) && number[number.length - 1] !== "0"){
                    return number.slice(0, number.length - 1)
                }
                else{
                    return number
                }
            }
        }
    }
    return(
        <>
        <div className="mainLogIn" ref={rootref}>
            <div className='formToSend' data-status={currentOption} ref={rootrefForm}>
                {confirmEmail === true ? (
                    <>
                         <div 
                            className='confirmEmail' 
                        >
                        <h3>Введите код, отправленный вам на почту</h3>
                        <div className='inputCode'>
                        <input 
                            type="text"
                            className='enterCode'
                            id='code1' 
                            value={code1} 
                            onChange={(event) => {
                                setCode1((prev) => {
                                    if(event.target.value.length > 1){
                                        return prev
                                    }
                                    return event.target.value
                                })
                                if(event.target.value.length !== 0){
                                    document.getElementById("code1").blur()
                                }
                                if(code2 === ""){
                                    document.getElementById("code2").focus()
                                }
                                else if(code3 === ""){
                                    document.getElementById("code3").focus()
                                }
                                else if(code4 === ""){
                                    document.getElementById("code4").focus()
                                }
                                else if(code5 === ""){
                                    document.getElementById("code5").focus()
                                }
                        }}
                        />
                        <input 
                            type="text" 
                            id='code2' 
                            className='enterCode' 
                            value={code2}
                            onChange={(event) => {
                                setCode2((prev) => {
                                    if(event.target.value.length > 1){
                                        return prev
                                    }
                                    return event.target.value
                                })
                                if(event.target.value.length !== 0){
                                    document.getElementById("code2").blur()
                                }
                                if(code1 === ""){
                                    document.getElementById("code1").focus()
                                }
                                else if(code3 === ""){
                                    document.getElementById("code3").focus()
                                }
                                else if(code4 === ""){
                                    document.getElementById("code4").focus()
                                }
                                else if(code5 === ""){
                                    document.getElementById("code5").focus()
                                }
                            }}
                        />
                        <input 
                            type="text"
                            id='code3'  
                            className='enterCode' 
                            value={code3}
                            onChange={(event) => {
                                setCode3((prev) => {
                                    if(event.target.value.length > 1){
                                        return prev
                                    }
                                    return event.target.value
                                })
                                if(event.target.value.length !== 0){
                                    document.getElementById("code3").blur()
                                }
                                if(code1 === ""){
                                    document.getElementById("code1").focus()
                                }
                                else if(code2 === ""){
                                    document.getElementById("code2").focus()
                                }
                                else if(code4 === ""){
                                    document.getElementById("code4").focus()
                                }
                                else if(code5 === ""){
                                    document.getElementById("code5").focus()
                                }
                            }}
                        />
                        <input 
                            type="text"
                            id='code4'  
                            className='enterCode' 
                            value={code4}
                            onChange={(event) => {
                                setCode4((prev) => {
                                    if(event.target.value.length > 1){
                                        return prev
                                    }
                                    return event.target.value
                                })
                                if(event.target.value.length !== 0){
                                    document.getElementById("code4").blur()
                                }
                                if(code1 === ""){
                                    document.getElementById("code1").focus()
                                }
                                else if(code2 === ""){
                                    document.getElementById("code2").focus()
                                }
                                else if(code3 === ""){
                                    document.getElementById("code3").focus()
                                }
                                else if(code5 === ""){
                                    document.getElementById("code5").focus()
                                }
                            }}
                        />
                        <input 
                            type="text"
                            id='code5'  
                            className='enterCode' 
                            value={code5}
                            onChange={(event) => {
                                setCode5((prev) => {
                                    if(event.target.value.length > 1){
                                        return prev
                                    }
                                    return event.target.value
                                })
                                if(event.target.value.length !== 0){
                                    document.getElementById("code5").blur()
                                }
                                if(code1 === ""){
                                    document.getElementById("code1").focus()
                                }
                                else if(code2 === ""){
                                    document.getElementById("code2").focus()
                                }
                                else if(code3 === ""){
                                    document.getElementById("code3").focus()
                                }
                                else if(code4 === ""){
                                    document.getElementById("code4").focus()
                                }
                            }}
                        />
                    </div>
                        <button className='confirmCode' onClick={async () => {
                            if(code !== (code1 + code2 + code3 + code4 + code5)){
                                globalStore.setErrorAuth("Неверный код")
                            }
                            else{
                                clearAllData()
                                globalStore.setCode("")
                                globalStore.setIsOpenLogin(false)
                                setCurrentOption("login")
                                setConfirmEmail(false)
                                const response = await globalStore.login(localStorage.getItem('phoneNumber'), localStorage.getItem('password'))
                                localStorage.removeItem('phoneNumber')
                                localStorage.removeItem('password')
                                if(response != undefined){
                                    navigate('/account')
                                }
                            }
                        }}  >Подтвердить</button>
                        <h4 className='ErrorMessage'>{globalStore.errorAuth}</h4>
                    </div>
                    </>
                ) : (
                    <>
                    <h1>{currentOption === "login" ? 'Вход' : 'Регистрация'}</h1>
                {currentOption === "login" ? (
                    <>
                        <div className='logInForm'>
                            <div className='enterInf'>
                                <div className='LogInFields' data-status={dataLogIn.phoneNumber === "" ? "noInf" : "anyInf"} >
                                    <div className='IconsLogIn'>
                                        <span>+375</span>
                                    </div>
                                    <input
                                        type="text" 
                                        className='casualInputWithIcon' 
                                        id='phoneNumber' 
                                        placeholder='Введите номер телефона...' 
                                        value={dataLogIn.phoneNumber}
                                        onChange={(event) => {
                                            setDataLogIn((prev) => {
                                                const buff = convertPhoneNumber(event.target.value)
                                                return (buff.length <= 14 ? ({
                                                    ...prev , phoneNumber:buff
                                                }) : ({
                                                    ...prev
                                                }))
                                            })
                                        }}/>
                                </div>
                                <div className='LogInFields' data-status={dataLogIn.password === "" ? "noInf" : "anyInf"} >
                                    <div className='IconsLogIn' id='EyeLogIn' onClick={() => {
                                        setSeePassword(!seePassword)
                                    }}>
                                        {seePassword === false ? (
                                            <>
                                                <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                                            </>
                                        ) : (
                                            <>
                                                <FontAwesomeIcon icon="fa-solid fa-eye" />
                                            </>
                                        )}
                                    </div>
                                    <input 
                                        type={seePassword === false ? "password" : "text"} 
                                        className='casualInputWithIcon' 
                                        id='password'
                                        placeholder='Введите пароль...' 
                                        value={dataLogIn.password}
                                        onChange={(event) => {
                                            setDataLogIn((prev) => ({
                                                ...prev, password:event.target.value
                                            }))
                                        }}/>
                                </div>
                                <button className='SubmitBtn' onClick={() => {
                                    clearAllData()
                                    login()
                                }}>Вход</button>
                            </div>
                            <span className='spanSagestion'>
                                Еще не зарегистрированы? 
                                <span className='spanChange' onClick={() => {
                                    clearLogInData()
                                    setCurrentOption("checkin")
                                    }}>Зарегистрироваться</span>
                            </span>
                            <h4 className='ErrorMessage'>{globalStore.errorAuth}</h4>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='mainCheckIn'>
                            <div className='casualInf'>
                                <span className='headerInf'>Персональные данные</span>
                                <div className='casualInput'>
                                    <label className='textForInput'>Номер телефона</label>
                                    <div className='phoneNumberCheckIn' data-status={dataCheckIn.phoneNumber === "" ? "noInf" : "anyInf"}>
                                        <span className='phoneNumberCheckInSpan'>+375</span>
                                        <input 
                                            className='phoneNumberCheckInInput' 
                                            type="text" 
                                            value={dataCheckIn.phoneNumber}
                                            onChange={(event) => {
                                                setDataCheckIn((prev) => {
                                                    const buff = convertPhoneNumber(event.target.value)
                                                    return (buff.length <= 14 ? ({
                                                        ...prev, phoneNumber:buff
                                                    }) : ({
                                                        ...prev
                                                    }))
                                                })
                                            }}/>
                                    </div>
                                </div>
                                <div className='casualInput'>
                                    <label className='textForInput'>Имя</label>
                                    <input
                                        data-status={dataCheckIn.name === "" ? "noInf" : "anyInf"} 
                                        type="text"
                                        value={dataCheckIn.name}
                                        onChange={(event) => {
                                            setDataCheckIn((prev) => ((/\d+/.test(Number((event.target.value)[event.target.value.length - 1]))) === true ? 
                                            (prev) : 
                                            ({
                                                ...prev,name:event.target.value
                                            })))
                                        }} />
                                </div>
                                <div className='casualInput'>
                                    <label className='textForInput'>Фамилия</label>
                                    <input
                                        data-status={dataCheckIn.secondname === "" ? "noInf" : "anyInf"}  
                                        type="text"
                                        value={dataCheckIn.secondname}
                                        onChange={(event) => {
                                            setDataCheckIn((prev) => 
                                            ((/\d+/.test(Number((event.target.value)[event.target.value.length - 1]))) === true ? 
                                            (prev) : 
                                            ({
                                                ...prev,secondname:event.target.value
                                            })))
                                        }} />
                                </div>
                                <div className='casualInput'>
                                    <label className='textForInput'>Электронная почта</label>
                                    <input
                                        data-status={dataCheckIn.email === "" ? "noInf" : "anyInf"}  
                                        type="text"
                                        value={dataCheckIn.email}
                                        onChange={(event) => {
                                            setDataCheckIn((prev) => ({
                                                ...prev, email:event.target.value
                                            }))
                                        }} />
                                </div>
                            </div>
                            <div className='passportInf'>
                                <span className='headerInf'>Паспортные данные</span>
                                <div className='casualInput'>
                                    <label className='textForInput'>Номер паспорта</label>
                                    <input
                                        data-status={dataCheckIn.passportNumber === "" ? "noInf" : "anyInf"}  
                                        type="text"
                                        value={dataCheckIn.passportNumber}
                                        onChange={(event) => {
                                            const buff = convertPassportNumber(event.target.value)
                                            setDataCheckIn((prev) => ({
                                                ...prev, passportNumber:buff
                                            }))
                                        }} />
                                </div>
                                <div className='casualInput'>
                                    <label className='textForInput'>Дата рождения</label>
                                    <input
                                        type="date"
                                        value={dataCheckIn.birthdayDate}
                                        min="1950-01-01"
                                        max={maxDate} 
                                        className='dateOfBirth'
                                        onChange={(event) => {
                                            let box = document.querySelector('.dateOfBirth')
                                            if(box.classList.contains('changeDateOfBirth')){
                                                box.classList.remove('changeDateOfBirth')
                                            }
                                            box.classList.add('changeDateOfBirth')
                                            setDataCheckIn((prev) => ({
                                                ...prev , birthdayDate:event.target.value
                                            }))
                                        }} />
                                </div>
                                <div className='casualInput'>
                                    <label className='textForInput'>Идентификационный номер</label>
                                    <input
                                        data-status={dataCheckIn.passportId === "" ? "noInf" : "anyInf"}  
                                        type="text"
                                        value={dataCheckIn.passportId}
                                        onChange={(event) => {
                                            const buff = convertPassportIdNumber(event.target.value)
                                            setDataCheckIn((prev) => ({
                                                ...prev,passportId:buff
                                            }))
                                        }} />
                                </div>
                            </div>
                            <div className='otherInf'>
                                <span className='headerInf'>Прочее</span>
                                <div className='tfAuth'>
                                    <label className='textForTf'>Сделать двухфакторную аутентификация по почте?</label>
                                    <div 
                                        className='tfAuthChange' 
                                        data-status={tfauth === true ? "yes" : "no"}
                                        onClick={() => {
                                            setTfAuth(!tfauth)
                                            setDataCheckIn((prev) => ({
                                                ...prev,tfAuth:!tfauth
                                            }))
                                            let box = document.querySelector('.tfAuthIcon')
                                            function animationDisagreeHandler(){
                                                box.classList.remove('finishAgree')
                                                box.classList.add('finishDisagree')
                                                box.classList.remove('animateTfIconDisagree')
                                            }
                                            function animationAgreeHandler(){
                                                box.classList.remove('finishDisagree')
                                                box.classList.add('finishAgree')
                                                box.classList.remove('animateTfIconAgree')
                                            }
                                            if((!tfauth) === false){
                                                box.removeEventListener("animationend",animationDisagreeHandler,false)
                                                box.removeEventListener("animationend",animationAgreeHandler,false)
                                                box.classList.add('animateTfIconDisagree')
                                                box.addEventListener("animationend",animationDisagreeHandler,false)
                                            }
                                            if((!tfauth) === true){
                                                box.removeEventListener("animationend",animationDisagreeHandler,false)
                                                box.removeEventListener("animationend",animationAgreeHandler,false)
                                                box.classList.add('animateTfIconAgree')
                                                box.addEventListener("animationend",animationAgreeHandler,false)
                                            }
                                        }}
                                        >
                                        <div className='tfAuthIcon'  data-status={tfauth === true ? "yes" : "no"}>
                                            {tfauth ==true ? (
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-circle-check" size='lg'/>
                                                </>
                                            ):(
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-circle-xmark" size='lg' />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className='passwordCheckIn'>
                                    <div className='lastDiv'>
                                    <label className='textForInputCheckIn'>Пароль</label>
                                    <div className='passwordCheckInDiv' data-status={dataCheckIn.password === "" ? "noInf" : "anyInf"} >
                                        <div className='passwordIcon' onClick={() => {
                                            setSeePasswordCheckIn(!seePasswordCheckIn)
                                        }}>
                                            {seePasswordCheckIn === false ? (
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                                                </>
                                            ):(
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-eye" />
                                                </>
                                        )}
                                        </div>
                                        <input 
                                            type={seePasswordCheckIn === false ? "password" : "text"} 
                                            className='casualInputWithIconCheckIn' 
                                            value={dataCheckIn.password}
                                            onChange={(event) => {
                                                setDataCheckIn((prev) => ({
                                                    ...prev, password:event.target.value
                                                }))
                                            }}/>
                                    </div>
                                    </div>
                                    <div className='lastDiv'>
                                    <label className='textForInputCheckIn'>Повторите пароль</label>
                                    <div className='passwordCheckInDiv' data-status={checkPassword === "" ? "noInf" : "anyInf"} >
                                        <div className='passwordIcon' onClick={() => {
                                            setSeePasswordCheckInAgain(!seePasswordCheckInAgain)
                                        }}>
                                            {seePasswordCheckInAgain === false ? (
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-eye-slash" />
                                                </>
                                            ):(
                                                <>
                                                    <FontAwesomeIcon icon="fa-solid fa-eye" />
                                                </>
                                            )}
                                        </div>
                                        <input 
                                            type={seePasswordCheckInAgain === false ? "password" : "text"} 
                                            className='casualInputWithIconCheckIn' 
                                            value={checkPassword}
                                            onChange={(event) => {
                                                setCheckPassword(event.target.value)
                                            }}/>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className='SubmitBtnCheckIn' onClick={() => registration()}>Зарегистрироваться</button>
                        <span className='spanSagestionCheckIn'>
                                Уже зарегистрированы? 
                                <span className='spanChangeCheckIn' onClick={() => {
                                    clearCheckInData()
                                    setCurrentOption("login")
                                    }}>Войти</span>
                        </span>
                        <h4 className='ErrorMessage'>{globalStore.errorAuth}</h4>
                    </>
                )}
                    </>
                )}
            </div>
        </div>
        </>
    )
}

export default observer(Auth);