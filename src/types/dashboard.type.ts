import type { User } from "./user.type.ts";
import type { Category } from "./category.type.ts";

interface DashboardUser {
    id: number;
    username: string;
    nickname: string;
    email: string;
    createdAt: string;
    deletedAt: string | null;
}

interface DashboardPost {
    id: number;
    createdAt: string;
    title: string;
    views: number;
    user: Pick<User, "id" | "nickname" | "email">;
    category: Pick<Category, "id" | "name">;
}

interface DashboardInquiry {
    id: number;
    createdAt: string;
    title: string;
    answer: string | null;
    user: Pick<User, "id" | "nickname" | "email">;
}

export interface DashboardSummary {
    users: DashboardUser[];
    posts: DashboardPost[];
    inquiries: DashboardInquiry[];
}