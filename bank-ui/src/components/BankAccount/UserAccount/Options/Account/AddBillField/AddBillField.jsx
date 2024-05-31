import { observer } from "mobx-react-lite"
import './AddBillFieldStyles.css'
import DropDownList from "./DropDownList/DropDownList"
import dropDownData from "./DropDownData"
import { useContext, useEffect, useState, useRef } from "react"
import { Context } from "../../../../../../main"


function AddBillField(){
    const {globalStore} = useContext(Context)

    const [reRenderPage, setReRenderPage] = useState(false)

    const rootref = useRef(null)
    const rootrefField = useRef(null)

    useEffect(() => {
        const closeDistribute = (event) => {
            const {target} = event;
            if(target instanceof Node && rootref.current?.contains(target) && !rootrefField.current?.contains(target)){
                globalStore.setIsOpenAddBill(false)
            }
        }
        window.addEventListener('click',closeDistribute)

        return () => {
            window.removeEventListener('click',closeDistribute)
        }
    }, [globalStore.isOpenAddBill])

    useEffect(() => {

        globalStore.setDropDownSelectedCurrency(dropDownData[0].data[0])
        globalStore.setDropDownSelectedRole(dropDownData[1].data[0])
        globalStore.setDropDownSelectedPurpose(dropDownData[2].data[0].purposes[0])

    }, [])

    function updatePage(data){
        setReRenderPage(!reRenderPage)
    }

    function addBill(){
        globalStore.addBill(localStorage.getItem('accountId'), globalStore.dropDownSelectedCurrency.name, globalStore.dropDownSelectedRole, globalStore.dropDownSelectedPurpose)
        location.reload()
    }

    return(
        <>
            <div className="addBillFieldMain" id={reRenderPage} ref={rootref}>
                <div className="addBillField" ref={rootrefField}>
                    <h2>Добавление счет</h2>
                    <div className="selectBillInf">
                        <p>Валюта: </p>
                        <DropDownList 
                            type={"currency"} 
                            typeData={dropDownData.filter((data) => data.type === "currency")[0]} 
                            globalStoreValue={globalStore.dropDownSelectedCurrency}
                            />
                        <p>Роль: </p>
                        <DropDownList 
                            type={"role"} 
                            typeData={dropDownData.filter((data) => data.type === "role")[0]}
                            globalStoreValue={globalStore.dropDownSelectedRole}
                            onChangeRole={updatePage}
                            />
                        <p>Назначение: </p>
                        <DropDownList 
                            type={"purpose"} 
                            typeData={dropDownData.filter((data) => data.type === "purpose")[0]}
                            globalStoreValue={globalStore.dropDownSelectedPurpose}
                            reRendePage={reRenderPage}
                            />
                    </div>
                    <button 
                        className="accountBtn" 
                        id="submitNewBill"
                        onClick={() => {
                            addBill()
                        }}
                        >Подтвердить</button>
                </div>
            </div>
        </>
    )
}

export default observer(AddBillField)