import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import './ConverterStyle.css'

function Converter({rates}){

    const [mainRate , setMainRate] = useState(null)

    const [changeValueGive , setChangeValueGive] = useState(false)
    const [changeValueHave , setChangeValueHave] = useState(false)
    const [changerRateGive , setChangeRateGive] = useState(false)
    const [changeRateHave , setChangeRateHave] = useState(false)

    const Calculate = (numberGive , numberHave , RateGive , RateHave , WhichOneChanged) => {
        let rate = tryFindRate(RateGive,RateHave)
        let CalculatedValue;
        if(WhichOneChanged === "Give"){
            CalculatedValue = numberGive * rate
            if(RateGive == "RUB" && RateHave === "BYN"){
                CalculatedValue /= 100
            }
        }
        else{
            CalculatedValue = numberHave / rate
            if(RateGive == "RUB" && RateHave === "BYN"){
                CalculatedValue /= 100
            }
        }
        if(rate === 0){
            rate = tryFindRate(RateHave,RateGive)
            if(WhichOneChanged === "Give"){
                CalculatedValue = numberGive / rate
                if(RateHave == "RUB" && RateGive === "BYN"){
                    CalculatedValue *= 100
                }
            }
            else{
                CalculatedValue = numberHave * rate
                if(RateHave == "RUB" && RateGive === "BYN"){
                    CalculatedValue /= 100
                }
            }
        }
        if(!Number.isInteger(CalculatedValue)){
            CalculatedValue = CalculatedValue.toFixed(2)
        }
        if(WhichOneChanged === "Give"){
            setCurrencyHave(CalculatedValue)
        }
        else{
            setCurrencyGive(CalculatedValue)
        }
        setMainRate(rate)
    }
    const tryFindRate = (rateGive, rateHave) => {
        for(let i = 0 ; i < rates.length ; i++){
            if(rates[i].sellIso === rateGive && rates[i].buyIso === rateHave){
                return rates[i].sellRate
            }
        }
        return 0
    }

    const [currentGive,setCurrentGive] = useState({
        name: "USD",
        img: "/US-flag.png",
        alt: "US-flag"
    })
    const [currentHave,setCurrentHave] = useState({
        name: "BYN",
        img: "/BY-flag.png",
        alt: "BY-flag"
    })

    const [currencyGive , setCurrencyGive] = useState(100)
    const [currencyHave, setCurrencyHave] = useState(null)


    const [isOpen , setIsOpen] = useState(false)
    const rootRef = useRef(null)
    const [isOpenHave , setIsOpenHave] = useState(false)
    const rootRefHave = useRef(null)

    const [ratesForSelect , setRatesForSelect] = useState(["USD" , "BYN" , "RUB" , "EUR"])
    const [ratesForSelectHave , setRatesForSelectHave] = useState(["USD" , "BYN" , "RUB" , "EUR"])
    const baseRatesForSelect = ["USD" , "BYN" , "RUB" , "EUR"]
    const baseRatesInf = [
        {
            name: "USD",
            img: "/US-flag.png",
            alt: "US-flag"
        },
        {
            name: "EUR",
            img: "/ES-flag.png",
            alt: "ES-flag"
        },
        {
            name: "RUB",
            img: "/RU-flag.png",
            alt: "RU-flag"
        },
        {
            name: "BYN",
            img: "/BY-flag.png",
            alt: "BY-flag"
        },
    ]
    

    useEffect(() => {
        const handleClick = (event) => {
            const {target} = event;
            if(target instanceof Node && !rootRef.current?.contains(target)){
                setIsOpen(false)
            }
        }
        window.addEventListener('click',handleClick)

        return () => {
            window.removeEventListener('click',handleClick)
        }
    },[isOpen])
    useEffect(() => {
        const handleClickHave = (event) => {
            const {target} = event;
            if(target instanceof Node && !rootRefHave.current?.contains(target)){
                setIsOpenHave(false)
            }
        }
        window.addEventListener('click',handleClickHave)

        return () => {
            window.removeEventListener('click',handleClickHave)
        }
    },[isOpenHave])


    const handleOptionClick = (newCurrentGiveRate) => {
        setIsOpen(false)
        const newCurrentGiveRateObject = baseRatesInf.filter((rate) => rate.name === newCurrentGiveRate)
        setCurrentGive(newCurrentGiveRateObject[0])
    }
    const handleOptionClickHave = (newCurrentGiveHave) => {
        setIsOpenHave(false)
        const newCurrentHaveRateObject = baseRatesInf.filter((rate) => rate.name === newCurrentGiveHave)
        setCurrentHave(newCurrentHaveRateObject[0])
    }


    const SelectedClick = () => {
        setIsOpen((prev) => {return (!prev)})
        setRatesForSelect(baseRatesForSelect.filter((rate) => rate !== currentHave.name))
    }
    const SelectedClickHave = () => {
        setIsOpenHave((prev) => {return (!prev)})
        setRatesForSelectHave(baseRatesForSelect.filter((rate) => rate !== currentGive.name))
    }

    useEffect(() => {
        if(rates && changerRateGive)
        {
            Calculate(currencyGive,currencyHave,currentGive.name,currentHave.name,"Give")
            setChangeRateGive(false)
        }
    },[changerRateGive])

    useEffect(() => {
        if(rates && changeRateHave)
        {
            Calculate(currencyGive,currencyHave,currentGive.name,currentHave.name,"Have")
            setChangeRateHave(false)
        }
    },[changeRateHave])

    useEffect(() => {
        if(rates && changeValueGive)
        {
            Calculate(currencyGive,currencyHave,currentGive.name,currentHave.name,"Give")
            setChangeValueGive(false)
        }
    },[changeValueGive])
    
    useEffect(() => {
        if(rates && changeValueHave)
        {
            Calculate(currencyGive,currencyHave,currentGive.name,currentHave.name,"Have")
            setChangeValueHave(false)
        }
    },[changeValueHave])

    if(rates && (currencyHave === null) && (currencyGive === 100)){
        setCurrencyHave(() => {
            return (tryFindRate("USD" , "BYN") * 100)
        })
        setMainRate(((rates.filter(rate => rate.sellIso === "USD" && rate.buyIso === "BYN"))[0]).sellRate)
    }

    const ConfigureLine = () => {
        return(
            <>
            {(currencyGive && currencyHave) ? <p>За {currencyGive} {currentGive.name} вы получите {currencyHave} {currentHave.name} по курсу {mainRate}</p> : ''}
            </>
        )
    }
    return(
        <>
        <div id='Converter'>
            <h3>Конвертер валют</h3>
            <p>Обмен расчитывается по текущему курсу</p>
            <div id='mainConverter'>
                    <div className='inputtoConvert'>
                        <div className='GiveHave'>
                            <p>Отдам</p>
                            <input 
                                type="text" 
                                value={currencyGive ? currencyGive : 0} 
                                onChange={(event) => {
                                    setCurrencyGive(prev => {
                                        const newValue = ((/\d+/.test(Number(event.target.value)) === true) ? 
                                            ((event.target.value[0] === "0" && event.target.value[0] !== ".") ? event.target.value.replace("0","") : event.target.value)  
                                            : prev)
                                        return (newValue.length <= 12 ? newValue : prev)
                                    })
                                    setChangeValueGive(true)
                                }}
                            />
                        </div>
                    <div className='Select' ref={rootRef}>
                        <div 
                            data-is-active={isOpen} 
                            className='Selected' 
                            onClick={() => {SelectedClick()}}
                            >
                            <div className='SelectedInf'>
                                <img src={currentGive.img} alt={currentGive.alt} className='SelectedFlag'/>
                                <p>{currentGive.name}</p>
                            </div>
                            <div className='ArrowToSelect'>
                                <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                            </div>
                        </div>
                        <div className='ToSelectItems'>
                            {isOpen && (ratesForSelect.map((rate , index) => {
                                return(
                                    <>
                                        <div 
                                            className='ToSelect' 
                                            id={rate === currentGive.name ? 'SelectedCurrency' : 'NotSelectedCurrency'} 
                                            onClick={() => {
                                                setChangeRateGive(true)
                                                handleOptionClick(rate)
                                            }}
                                            data-status={(index + 1).toString()}
                                            >
                                            <div className='ToSelectInf'>
                                                <img 
                                                src={rate === "BYN" ? "/BY-flag.png" : 
                                                    (rate === "EUR" ? "/ES-flag.png" : 
                                                    (rate === "RUB" ? "/RU-flag.png" : "/US-flag.png"))}
                                                alt={rate === "BYN" ? "BY-flag" : 
                                                    (rate === "EUR" ? "ES-flag" : 
                                                    (rate === "RUB" ? "RU-flag" : "US-flag"))}
                                                className='ToSelectFlag'
                                                />
                                                <p className='ToSelectText'>{rate}</p>
                                            </div>

                                            {rate === currentGive.name && (
                                                <>
                                                    <div className='SelectedCurrencyIcon'>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" size="xs" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )
                            }))}
                            </div>
                        </div>
                    </div>
                    <div className='inputtoConvert'>
                        <div className='GiveHave'>
                                <p>Получу</p>
                                <input 
                                    type="text" 
                                    value={rates ? ((currencyGive !== null) ? (currencyHave ? currencyHave : 0) : 0) : "Loading..."} 
                                    onChange={(event) => {
                                        setChangeValueHave(true)
                                        setCurrencyHave(prev => {
                                            const newValue = ((/\d+/.test(Number(event.target.value)) === true) ? 
                                            ((event.target.value[0] === "0" && event.target.value[0] !== ".") ? event.target.value.replace("0","") : event.target.value)  
                                            : prev)
                                            return (newValue.length <= 12 ? newValue : prev)
                                        })
                                    }}
                                />
                        </div>
                        <div className='Select' ref={rootRefHave}>
                        <div 
                            data-is-active={isOpenHave} 
                            className='Selected' 
                            onClick={() => {SelectedClickHave()}}
                            >
                            <div className='SelectedInf'>
                                <img src={currentHave.img} alt={currentHave.alt} className='SelectedFlag'/>
                                <p>{currentHave.name}</p>
                            </div>
                            <div className='ArrowToSelect'>
                                <FontAwesomeIcon icon="fa-solid fa-chevron-down" />
                            </div>
                        </div>
                        <div className='ToSelectItems'>
                            {isOpenHave && (ratesForSelectHave.map((rate , index) => {
                                return(
                                    <>
                                        <div 
                                            className='ToSelect' 
                                            id={rate === currentHave.name ? 'SelectedCurrency' : 'NotSelectedCurrency'} 
                                            onClick={() => {
                                                setChangeRateHave(true)
                                                handleOptionClickHave(rate)
                                            }}
                                            data-status={(index + 1).toString()}
                                            >
                                            <div className='ToSelectInf'>
                                                <img 
                                                src={rate === "BYN" ? "/BY-flag.png" : 
                                                    (rate === "EUR" ? "/ES-flag.png" : 
                                                    (rate === "RUB" ? "/RU-flag.png" : "/US-flag.png"))}
                                                alt={rate === "BYN" ? "BY-flag" : 
                                                    (rate === "EUR" ? "ES-flag" : 
                                                    (rate === "RUB" ? "RU-flag" : "US-flag"))}
                                                className='ToSelectFlag'
                                                />
                                                <p className='ToSelectText'>{rate}</p>
                                            </div>

                                            {rate === currentHave.name && (
                                                <>
                                                    <div className='SelectedCurrencyIcon'>
                                                        <FontAwesomeIcon icon="fa-solid fa-circle" size="xs" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )
                            }))}
                            </div>
                        </div>
                    </div>
                    <div className='textRateInf'>
                        {rates ? ConfigureLine() : <h1>Loading...</h1>}
                    </div>
            </div>
        </div>
        </>
    )
}
export default Converter