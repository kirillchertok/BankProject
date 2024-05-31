import { observer } from "mobx-react-lite"
import './DropDownListStyles.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../../../../main"


function DropDownList({ type, typeData, globalStoreValue, onChangeRole, reRenderPage }){
    const {globalStore} = useContext(Context)

    const [selectedValue, setSelectedValue] = useState(type === "purpose" ? typeData.data[0].purposes[0] : (type === "card" ? typeData[0].cardNumber : typeData.data[0]))
    const [toSelectValue, setToSelectValue] = useState(findToSelectValue())
    const [isOpenDropDown, setIsOpenDropDown] = useState(false)


    useEffect(() => {
        setToSelectValue(findToSelectValue())
        if(type === "purpose"){
            globalStore.setDropDownSelectedPurpose(selectedValue)
        }
        else if(type === "role"){
            globalStore.setDropDownSelectedRole(selectedValue)
            onChangeRole("update")
        }
        else if(type === "currency"){
            globalStore.setDropDownSelectedCurrency(selectedValue)
        }
        else if(type === 'card'){
            globalStore.setDropDownSelectedCard(selectedValue)
        }
    }, [selectedValue])

    useEffect(() => {
        if(type === "purpose"){
            const tmp = typeData.data.filter((purpose) => purpose.role === globalStore.dropDownSelectedRole)
            let value
            if(tmp.length !== 0){
                value = tmp[0].purposes.filter((purpose) => purpose !== selectedValue)[0]
            }
            else{
                value = "Не нужно выбирать"
            }
            setSelectedValue(value)
            setToSelectValue(findToSelectValue())
        }
    }, [globalStore.dropDownSelectedRole])

    useEffect(() => {
        if(type === "card"){
            globalStore.setDropDownSelectedCard(selectedValue)
        }
    }, [])


    function findToSelectValue(){
        let value = null;

        if(type === "purpose"){
            if(globalStore.dropDownSelectedRole === undefined){
                value = typeData.data[0].purposes.filter((purpose) => purpose !== selectedValue)
            }
            else{
                const tmp = typeData.data.filter((purpose) => purpose.role === globalStore.dropDownSelectedRole)
                if(tmp.length !== 0){
                    value = tmp[0].purposes.filter((purpose) => purpose !== selectedValue)
                }
            }
        }
        else if(type === "role"){
            value = typeData.data.filter((role) => role !== selectedValue)
        }
        else if(type === "currency"){
            value = typeData.data.filter((currency) => currency !== selectedValue)
        }
        else if(type === "card"){
            value = typeData.filter((cards) => cards.cardNumber !== selectedValue)
        }

        return value;
    }

    return(
        <>
            <div className="dropDownListMain" data-status={globalStoreValue} id={type}>
                <div className="dropDownListField">
                    <div 
                        className="selectedData"
                        data-is-active={selectedValue === "Не нужно выбирать" ? false : isOpenDropDown}
                        data-status={selectedValue}
                        >
                        {type === "currency" ? (
                            <>
                                <div className="currencyData">
                                    <img src={selectedValue.img} alt={selectedValue.alt} />
                                    <p>{selectedValue.name}</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <p>{selectedValue}</p>
                            </>
                        )}
                        <FontAwesomeIcon 
                            icon="fa-solid fa-chevron-down" 
                            className="selectedDataIcon"
                            onClick={() => {
                                setIsOpenDropDown((prev) => !prev)
                            }} 
                        />
                    </div>
                    {isOpenDropDown && (
                        <>
                            {selectedValue === "Не нужно выбирать" ? (
                                <>    
                                </>
                            ) : (
                                <>
                                    <div className="toSelectDataDropDown">
                                    {toSelectValue.map((value, index) => {
                                        const dataLen = toSelectValue.length
                                        if(type === 'card'){
                                            value = value.cardNumber
                                        }
                                        return(
                                        <>
                                            <div 
                                                className="toSelectValue" 
                                                data-status={dataLen.toString()}
                                                key={index} 
                                                id={"element" + (index === toSelectValue.length - 1? "last" : index.toString())}
                                                onClick={() => {
                                                    setIsOpenDropDown(false)
                                                    setSelectedValue(value)
                                                }}
                                                >
                                                {type === "currency" ? (
                                                    <>
                                                        <div className="currencyToSelect">
                                                            <img src={value.img} alt={value.alt} />
                                                            <p>{value.name}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>{value}</p>
                                                    </>
                                                )}
                                            </div>
                                    </>
                                    )
                                    })}
                                    </div>   
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default observer(DropDownList)