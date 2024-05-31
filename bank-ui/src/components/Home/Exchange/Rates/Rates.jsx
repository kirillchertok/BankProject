import './RatesStyle.css'

function Rates({ rates }){
    return(
        <>
            <div id='Rates'>
                <h3>Текущий курс</h3>
                <p>Курсы действую с момента {rates ? rates[0].date : "Loading..."}</p>
                <ul id='RatesInf' key={123}>
                    <li key={789}>
                        <div className='Categories'>
                            <p className='CategoriesInf'>Валюта</p>
                            <p className='CategoriesInf' id='SellPriceLabel'>Покупка</p>
                            <p className='CategoriesInf' id='BuyPriceLabel'>Продажа</p>
                        </div>
                    </li>
                    {
                        rates ?
                        (rates.map((rate , index) => (
                                    <li key={index}>
                                        <div className='Categories' key={rate.sellIso}>
                                            <div className='CurrencyInf'>
                                                <img 
                                                src={
                                                    rate.sellIso === "USD" ? "/US-flag.png" :
                                                    (rate.sellIso === "EUR" ? "/ES-flag.png" : "/RU-flag.png") 
                                                } 
                                                alt={
                                                    rate.sellIso === "USD" ? "US-flag" :
                                                    (rate.sellIso === "EUR" ? "ES-flag" : "RU-flag") 
                                                } 
                                                className='flags'/>
                                                <p>{rate.sellIso}</p>
                                            </div>
                                            <p className='RatesInfSell'>{rate.sellRate}</p>
                                            <p className='RatesInf'>{rate.buyRate}</p>
                                        </div>
                                    </li>
                            ))) : <h1>Loading...</h1>
                        }
                </ul>
                <p>*Для курса RUB взято значение относительно 100RUB</p>
            </div>
        </>
    )
}


export default Rates