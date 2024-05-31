import { UUID } from "crypto";

export interface MailResponse{
    id: UUID;
    code: string;
}