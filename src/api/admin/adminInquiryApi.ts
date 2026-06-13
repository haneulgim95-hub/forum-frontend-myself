import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Inquiry } from "../../types/inquiry.type.ts";
import type { InquiryAnswerInputType } from "../../schemas/inquiry/inquiryAnswerSchema.ts";

const fetchInquiryList = async (page: number, size: number): Promise<PaginationResponseType<Inquiry>> => {
    const response = await axiosInstance.get("/admin/inquiry/list", {
        params: {
            page,
            size,
        }
    });
    return response.data.data;
};

const fetchInquiryById = async (id: number): Promise<Inquiry> => {
    const response = await axiosInstance.get(`/admin/inquiry/${id}`);
    return response.data.data;
};

const updateAnswerInquiry = async (id: number, input: InquiryAnswerInputType): Promise<Inquiry> => {
    const response = await axiosInstance.patch(`/admin/inquiry/${id}`, input);
    return response.data.data;
};

const deleteAnswerInquiry = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/inquiry/${id}`);
};

export default { fetchInquiryList, fetchInquiryById, updateAnswerInquiry, deleteAnswerInquiry };