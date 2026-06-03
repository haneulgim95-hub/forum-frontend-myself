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
    option1Text: string | null;
    option2Text: string | null;
    vote: {
        option1Count: number;
        option2Count: number;
        totalCount: number;
        hasVoted: boolean;
    } | null;

    user: Pick<User, "id" | "nickname" | "email">;
}