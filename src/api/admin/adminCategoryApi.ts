import axiosInstance from "../axiosInstance.ts";
import type { Category } from "../../types/category.type.ts";
import type { AdminCreateCategoryInputType } from "../../schemas/admin/category/adminCategoryCreateSchema.ts";

const fetchCategoryList = async (): Promise<Category[]> => {
    const response = await axiosInstance.get("/admin/category/list");
    return response.data.data;
};

const createCategory = async (data: AdminCreateCategoryInputType): Promise<Category> => {
    const response = await axiosInstance.post("/admin/category/create", data);
    return response.data.data;
}

const toggleCategoryStatus = async (id: number): Promise<Category> => {
    const response = await axiosInstance.patch(`/admin/category/${id}/status`);
    return response.data.data;
}

export default {fetchCategoryList , createCategory, toggleCategoryStatus};