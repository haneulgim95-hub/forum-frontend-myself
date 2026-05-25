import type { User } from "../../../types/user.type.ts";
import axiosInstance from "../../axiosInstance.ts";
import type { AdminCreateUserInputType } from "../../../schemas/admin/user/adminCreateUserSchema.ts";

const fetchUserList = async (): Promise<User[]> => {
    const response = await axiosInstance.get("/admin/user/list");
    return response.data.data;
};

const createUser = async (input: AdminCreateUserInputType): Promise<User> => {
    const response = await axiosInstance.post("/admin/user/create", input);
    return response.data.data;
};

export default { fetchUserList, createUser };