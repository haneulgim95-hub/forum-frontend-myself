import type { User } from "./user.type.ts";
import type { Answer } from "./answer.type.ts";

export interface Inquiry {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    content: string;
    userId: number;
    user: Pick<User, "id" | "nickname" | "email">
    answers: Answer[];
}