import axiosInstance from "../axiosInstance.ts";
import type { Reply } from "../../types/reply.type.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";

const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post("/reply/create", { postId, content });
    return response.data.data;
};

const fetchRepliesByPostId = async (
    postId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<Reply>> => {
    const response = await axiosInstance.get(`/reply/${postId}?page=${page}&size=${size}`);
    return response.data.data;
};

export default { createReply, fetchRepliesByPostId };