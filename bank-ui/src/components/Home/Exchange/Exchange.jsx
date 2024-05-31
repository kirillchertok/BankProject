import './ExchangeStyle.css'
import axios from 'axios'
import {useState , useEffect} from 'react'
import Rates from './Rates/Rates'
import Converter from './Converter/Converter'

export default function Exchange(){

    const apiUrl = 'https://developerhub.alfabank.by:8273/partner/1.0.1/public/rates'
    
    const [rates , setRates] = useState(null)
    useEffect(() =>{
        const getResponse = async () => {
            const response = await axios.get(apiUrl)
            setRates(response.data.rates)
        }
        getResponse()
    },[])
    return(
        <>
        <section id='ExchangeSection'>
            <div className="mainExchange">
                <Rates rates={rates ? rates.filter((Rate) => Rate.buyIso == "BYN") : rates} />
                <Converter rates={rates}/>
            </div>
        </section>
        </>
    )
}