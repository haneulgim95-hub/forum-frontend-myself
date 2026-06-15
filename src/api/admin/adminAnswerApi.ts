import axiosInstance from "../axiosInstance.ts";
import type { Answer } from "../../types/answer.type.ts";
import type { AnswerInputType } from "../../schemas/answer/answerSchema.ts";

const createAnswer = async (inquiryId: number, input: AnswerInputType): Promise<Answer> => {
    const response = await axiosInstance.post(`/admin/answer/create/${inquiryId}`, input);
    return response.data.data;
};

const updateAnswer = async (answerId: number, input: AnswerInputType): Promise<Answer> => {
    const response = await axiosInstance.patch(`/admin/answer/update/${answerId}`, input);
    return response.data.data;
};

const deleteAnswer = async (answerId: number): Promise<void> => {
    await axiosInstance.delete(`/admin/answer/delete/${answerId}`);
};

export default { createAnswer, updateAnswer, deleteAnswer };
