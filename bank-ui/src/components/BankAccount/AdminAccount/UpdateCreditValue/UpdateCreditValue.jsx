import { observer } from "mobx-react-lite"
import './UpdateCreditValueStyles.css'
import DropDownList from "../../UserAccount/Options/Account/AddBillField/DropDownList/DropDownList"
import dropDownData from "../../UserAccount/Options/Account/AddBillField/DropDownData"
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function UpdateCreditValue(){
    const {globalStore} = useContext(Context)

    const [amountOfMoney, setAmountOfMoney] = useState("")

    const fakeCardData = [
        {
            cardNumber: "6"
        },
        {
            cardNumber: "12"
        },
        {
            cardNumber: "18"
        },
        {
            cardNumber: "24"
        },
        {
            cardNumber: "30"
        }
        ,{
            cardNumber: "36"
        }
        ,{
            cardNumber: "42"
        }
        ,{
            cardNumber: "48"
        }
        ,
        {
            cardNumber: "54"
        },
        {
            cardNumber: "60"
        }
    ]

    useEffect(() => {

        globalStore.setDropDownSelectedCurrency(dropDownData[0].data[0])
        globalStore.setDropDownSelectedCard(fakeCardData[0].cardNumber)

    }, [])

    async function updateCreditValue(){
        console.log(globalStore.dropDownSelectedCard)
        console.log(globalStore.dropDownSelectedCurrency.name.toUpperCase())
        console.log(amountOfMoney)
        await globalStore.UpdateCreditValue(globalStore.dropDownSelectedCurrency.name.toUpperCase(), globalStore.dropDownSelectedCard, amountOfMoney)
    }

    return (
        <>
            <div className="updateCreditValueMain">
                <p className="getUsersHeader">Введите данные</p>
                <div className="dropDownCreditValue">
                    <DropDownList 
                            type={"currency"} 
                            typeData={dropDownData.filter((data) => data.type === "currency")[0]} 
                            globalStoreValue={globalStore.dropDownSelectedCurrency}
                            />
                </div>
                <div className="dropDownCreditValue">
                    <DropDownList 
                            type={"card"} 
                            typeData={fakeCardData} 
                            globalStoreValue={globalStore.dropDownSelectedCurrency}
                            />
                </div>
                <input 
                    type="text"
                    className="necessaryInf"
                    value={amountOfMoney}
                    placeholder="Новая максимальная сумма..."
                    onChange={(event) => {
                        setAmountOfMoney(event.target.value)
                    }}     
                />
                <button className="submitRequest" onClick={() => {updateCreditValue()}}>Подтвердить</button>
            </div>
        </>
    )
}

export default observer(UpdateCreditValue)