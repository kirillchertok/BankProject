import { UUID } from "crypto";

export interface AuthResponse{
    id: UUID;
    role: string;
    bankAccountId: UUID;
    tokenA: string;
    tokenR: string;
}