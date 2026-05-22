export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
}

export type GenderType = typeof Gender[keyof typeof Gender];

export const Role = {
    ADMIN: "ADMIN",
    USER: "USER",
}

export type RoleType = typeof Role[keyof typeof Role];

export interface User {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    name: string;
    nickname: string;
    email: string;
    phoneNumber: string | null;
    birthdate: string | null;
    gender: GenderType;
    role: RoleType;
}