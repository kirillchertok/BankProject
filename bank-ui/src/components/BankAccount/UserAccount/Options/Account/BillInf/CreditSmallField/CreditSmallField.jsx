import { observer } from "mobx-react-lite"
import './CreditSmallField.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

function CreditSmallField({ creditData, status }){
    console.log(creditData)
    return(
        <>
            <div className="smallCardFiled" data-status={status === false ? "creditApplication" : "activeCredit"}>
                <div className="smallCardFiledIcon">
                    <FontAwesomeIcon icon="fa-solid fa-sack-dollar" />
                </div>
                <div className="smallCardFiledText">
                    <span>{creditData.dateStart}</span>
                    <span>Осталось в этом: {creditData.leftToPayThisMonth}</span>
                </div>
            </div>
        </>
    )
}

export default observer(CreditSmallField)