import { UUID } from "crypto";

export interface IAdminMessage{
    messageId: UUID,
    messageTitle: string,
    message: string,
    connectedId: string[],
    isDone: boolean,
    dateCreate: string
}