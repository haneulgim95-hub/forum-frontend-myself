import type { User } from "../../../types/user.type.ts";
import axiosInstance from "../../axiosInstance.ts";
import type { AdminCreateUserInputType } from "../../../schemas/admin/user/adminCreateUserSchema.ts";
import type { AdminUpdateUserInputType } from "../../../schemas/admin/user/adminUpdateUserSchema.ts";
import type { PaginationResponseType } from "../../../types/common.type.ts";

const fetchUserList = async (page: number, size: number): Promise<PaginationResponseType<User>> => {
    const response = await axiosInstance.get(`/admin/user/list?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchUserById = async (id: number): Promise<User> => {
    const response = await axiosInstance.get(`/admin/user/${id}`);
    return response.data.data;
};

const createUser = async (input: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", input);
    return response.data.data;
};

const updatedUser = async (id: number, input: AdminUpdateUserInputType): Promise<User> => {
    const response = await axiosInstance.patch(`/admin/user/${id}`, input);
    return response.data.data;
};

const deleteUser = async (id: number): Promise<User> => {
    const response = await axiosInstance.patch(`admin/user/${id}/delete`);
    return response.data.data;
};

export default { fetchUserList, createUser, updatedUser, fetchUserById, deleteUser };