import type { User } from "./user.type.ts";

export interface Reply {
    id: number;
    createdAt: string;
    updatedAt: string;
    content: string;
    userId: number;
    postId: number;
    user: Pick<User, "id" | "nickname" | "email">
}