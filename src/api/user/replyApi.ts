import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Reply } from "../../types/reply.type.ts";

const createReply = async (postId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.post("/reply/create", { postId, content });
    return response.data.data;
};

const getRepliesByPostId = async (postId: number, page: number, size: number): Promise<PaginationResponseType<Reply>> => {
    const response = await axiosInstance.get(`/reply/${postId}`, {
        params: {
            page,
            size,
        }
    })
    return response.data.data;
};

const deleteReply = async (replyId: number): Promise<void> => {
    await axiosInstance.delete(`/reply/${replyId}`);
};

const updateReply = async (replyId: number, content: string): Promise<Reply> => {
    const response = await axiosInstance.patch(`/reply/${replyId}`, { content });
    return response.data.data;
};

export default { createReply, getRepliesByPostId, updateReply, deleteReply };