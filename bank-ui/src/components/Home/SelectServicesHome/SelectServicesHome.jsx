import CardsHtml from './CardsHtml/CardsHtml'
import './SelectServicesHome.styles.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function SelectServicesHome(){

    return(
        <>
        <p></p>
        <section id='SelectSection'>
            <ul className='mainUl'>
                <li className="left" >
                    <h2>Преимущества</h2>
                    <ul className='advantegesUl'>
                        <li className='advantegesLi'>Лучшие процентные ставки</li>
                        <li className='advantegesLi'>Удобное WEB-приложение</li>
                        <li className='advantegesLi'>Бесплатные карты в разных валютах</li>
                        <li className='advantegesLi'>Надежность</li>
                    </ul>
                    <FontAwesomeIcon icon="fa-solid fa-thumbs-up"  className='advanteges'/>
                </li>
                <li className="right">
                    <h2>Наши услуги</h2>
                    <ul className='advantegesUl'>
                        <li className='advantegesLi'>Банковские вклады</li>
                        <li className='advantegesLi'>Денежные переводы</li>
                        <li className='advantegesLi'>Кредиты</li>
                        <li className='advantegesLi'>Обмен валют</li>
                    </ul>
                    <FontAwesomeIcon icon="fa-solid fa-money-bill-trend-up" className='services'/>
                </li>
                <li className="middle" >
                    <h2>Наши карты</h2>
                    <div className='InfAboutCards'>
                        <p className="textaboutCards">Вы можете заказать наши бесплатные карты в любое время, используя наше WEB-приложение</p>
                        <button className="buycard">Заказать карту</button>
                    </div>
                    <div className='cardsHtml'>
                        <CardsHtml/>
                    </div>
                </li>
            </ul>
        </section>
        </>
    )
}