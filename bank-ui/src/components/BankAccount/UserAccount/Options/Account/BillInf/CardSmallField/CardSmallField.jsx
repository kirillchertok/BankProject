import { observer } from "mobx-react-lite"
import './CardsSmallFieldStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function CardSmallField({ cardData }){

    function convertCardNumber(str){
        return str.slice(0,4)+ " " + str.slice(4,8) + " " + str.slice(8,12) + " " + str.slice(12,16)
    }
    return(
        <>
            <div className="smallCardFiled">
                <div className="smallCardFiledIcon">
                    <FontAwesomeIcon icon="fa-solid fa-credit-card" />
                </div>
                <div className="smallCardFiledText">
                    <span>{convertCardNumber(cardData.cardNumber)}</span>
                    <span>{cardData.amountOfMoney}</span>
                </div>
            </div>
        </>
    )
}

export default observer(CardSmallField)