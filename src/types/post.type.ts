import type { User } from "./user.type.ts";

export interface Post {
    id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    title: string;
    content: string;
    views: number;
    userId: number;
    categoryId: number;
    user: Pick<User, "id" | "nickname" | "email">;
    option1Text: string | null;
    option2Text: string | null;
}