import { observer } from "mobx-react-lite"
import './AdminAccountStyles.css'
import { useState } from "react"
import GetUsers from "./GetUsers/GetUsers";
import BanUnBanUser from "./BanUnBanUser/BanUnBanUser";
import GetBills from "./GetBills/GetBills";
import AdminMessages from "./AdminMessages/AdminMessages";
import GetTransactions from "./GetTransactions/GetTransactions";
import GetCards from "./GetCards/GetCards";
import GetCredits from "./GetCredits/GetCredits";
import ChangeBalance from "./ChangeBalance/ChangeBalance";
import UpdateCreditValue from "./UpdateCreditValue/UpdateCreditValue";

function AdminAccount() {

    const [currentAdminOption, setCurrentAdminOption] = useState(1);
    return(
        <>
        <div className="adminMain">
            <div className="adminMainField">
                <div className="adminOptions">
                    <div className="firstOption" onClick={() => {setCurrentAdminOption(1)}}>
                        <p>Получение</p>
                        <p>пользователей</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(2)}}>
                        <p>Получение счетов</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(3)}}>
                        <p>Получение</p>
                        <p>транзакций</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(4)}}>
                        <p>Получение карт</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(5)}}>
                        <p>Получение кредитов</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(6)}}>
                        <p>Забанить/Разбанить пользователя</p>
                    </div>
                    <div onClick={() => {setCurrentAdminOption(7)}}>
                        <p>Начислить/</p>
                        <p>Отнять баланс</p>
                    </div>
                    <div className="lastOption" onClick={() => {setCurrentAdminOption(8)}}>Изменить кредитную ставку</div>
                </div>
                <div className="adminMainScreen">
                    {currentAdminOption === 1 ? (
                        <>
                            <GetUsers />
                        </>
                    ) : (currentAdminOption === 6 ? (
                        <>
                            <BanUnBanUser />
                        </>
                    ) : (currentAdminOption === 2 ? (
                        <>
                            <GetBills />
                        </>
                    ) : (currentAdminOption === 3 ? (
                        <>
                            <GetTransactions />
                        </>
                    ) : (currentAdminOption === 4 ? (
                        <>
                            <GetCards />
                        </>
                    ) : (currentAdminOption === 5 ? (
                        <>
                            <GetCredits />
                        </>
                    ) : (currentAdminOption === 7 ? (
                        <>
                            <ChangeBalance />
                        </>
                    ) : (
                        <>
                            <UpdateCreditValue />
                        </>
                    ))
                    )))))}
                </div>
                <AdminMessages />
            </div>
        </div>
        </>
    )
}

export default observer(AdminAccount)