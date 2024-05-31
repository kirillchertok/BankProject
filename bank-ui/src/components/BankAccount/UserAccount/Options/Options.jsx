import { observer } from "mobx-react-lite"
import './OptionsStyles.css'
import { useNavigate } from 'react-router-dom'


function Options(){
    const navigate = useNavigate()
    return(
        <>
            <div className="MainOptions">

                <div 
                    className="Option" 
                    id="First" 
                    onClick={() => {
                        navigate('/account/userAccount')
                    }}
                >Аккаунт</div>

                <div 
                    className="Option"
                    onClick={() => {
                        navigate('/account/Transactions')
                    }}
                >Переводы</div>

                <div 
                    className="Option" 
                    onClick={() => {
                        navigate('/account/Cards')
                    }}
                >Карты</div>

                <div 
                    className="Option"
                    onClick={() => {
                        navigate('/account/Credits')
                    }}
                >Кредиты</div>

                <div 
                    className="Option"
                    id="Last" 
                    onClick={() => {
                        navigate('/account/makeTransaction')
                    }}
                >Сделать перевод</div>
            </div>
        </>
    )
}

export default observer(Options)