import './Cards.css'

export default function CardsHtml(){
    return(<>
    <div className='cardMain'>
            <div className='CardsHtml'>
                <div className='cardCarcase' id='Red'>
                    <div className='CurrencyAndBank'>
                        <p>BYN</p>
                        <p>Bank</p>
                    </div>
                    <div className='Chip'></div>
                    <div className='Name'>
                        <p>User Name</p>
                    </div>             
                </div>
                <div className='cardCarcase' id='Silver'>
                    <div className='CurrencyAndBank'>
                        <p>USD</p>
                        <p>Bank</p>
                    </div>
                    <div className='Chip'></div>
                    <div className='Name'>
                        <p>User Name</p>
                    </div>             
                </div>
                <div className='cardCarcase' id='Gold'>
                    <div className='CurrencyAndBank'>
                        <p>EUR</p>
                        <p>Bank</p>
                    </div>
                    <div className='Chip'></div>
                    <div className='Name'>
                        <p>User Name</p>
                    </div>             
                </div>
            </div>
        </div>
    </>)
}