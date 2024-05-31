import { observer } from "mobx-react-lite"
import './AdminMessagesStyles.css'
import { useContext, useEffect, useState } from "react"
import { Context } from "../../../../main"

function AdminMessages(){
    const {globalStore} = useContext(Context) 

    const [messages, setMessages] = useState(null)

    const fetchMessages = async () => {
        const response = await globalStore.GetAllAdminMessages()
        if(response.length != 0){
            setMessages(response.filter(message => message.isDone === false))
        }
    }

    useEffect(() => {

        fetchMessages()

    }, [])

    function convertStr(str){
        const start = str.substring(6, 10)
        const end = str.substring(0, 2)
        const middle = str.substring(3, 5)
        return start + "-" + middle + "-" + end
    }

    function messageTask(message, status){
        if(message.messageTitle === "Одобрение кредита"){
            if(status){
                globalStore.ApproveCredit(
                    message.connectedId.map((id) => id.split("/"))[0][1], 
                    message.messageId, 
                    message.connectedId.map((id) => id.split("/"))[2][1])
            }
            else{
                globalStore.RejectCredit(
                    message.connectedId.map((id) => id.split("/"))[0][1], 
                    message.messageId, 
                    message.connectedId.map((id) => id.split("/"))[2][1])
            }
        }
    }

    return(
        <>
            <div className="adminMessages">
                <p className="adminMessagesHeader">Сообщения</p>
                <div className="messages">
                    {messages !== null && (
                        <>
                            {messages.map((message) => {
                                const connectedIds = message.connectedId.map((id) => id.split("/"))
                                const messageArray = message.message.split("/")
                                const status = Date.parse(convertStr(message.dateCreate.split(" ")[0].replace(/\./g, "-"))) - Date.parse(new Date()) < 0 ? "fast" : "notfast"
                                return (
                                    <>
                                        <div className="message" data-status={status}>
                                            <p>{message.messageTitle}</p>
                                            <div className="mainMessageField">
                                            {messageArray.map((messageOne) => {
                                                return(
                                                    <>
                                                        <p>{messageOne}</p>
                                                    </>
                                                )
                                            })}    
                                            </div>
                                            <div>
                                            {connectedIds.map((id) => {
                                                return(
                                                    <>
                                                        <div>
                                                            <span>{id[0]} : </span>
                                                            <span><strong>{id[1]}</strong></span>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                            </div>
                                            {message.messageTitle === "Одобрение кредита" && (
                                                <>
                                            <button
                                                className="accountBtn"
                                                id="messageTaskBtn"
                                                onClick={() => {
                                                    messageTask(message, true)
                                                }}
                                                >
                                                Одобрить</button>
                                            <button
                                                className="accountBtn"
                                                id="messageTaskBtn"
                                                onClick={() => {
                                                    messageTask(message, false)
                                                }}
                                                >
                                                Отклонить</button>
                                                </>
                                            )}
                                        </div>
                                    </>
                                )
                            })}
                        </>
                    ) }
                </div>
            </div>
        </>
    )
}

export default observer(AdminMessages)