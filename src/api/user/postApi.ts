import axiosInstance from "../axiosInstance.ts";
import type { PaginationResponseType } from "../../types/common.type.ts";
import type { Post, RecentPost } from "../../types/post.type.ts";
import type { CreatePostInputType } from "../../schemas/post/createPostSchema.ts";

const fetchRecentPostList = async (): Promise<RecentPost[]> => {
    const response = await axiosInstance.get("/post/recent/list");
    return response.data.data;
};

const fetchPostListByCategory = async (
    categoryId: number,
    page: number,
    size: number,
): Promise<PaginationResponseType<Post>> => {
    const response = await axiosInstance.get(`/post/list/${categoryId}?page=${page}&size=${size}`);
    return response.data.data;
};

const fetchPostById = async (postId: number): Promise<Post> => {
    const response = await axiosInstance.get(`/post/${postId}`);
    return response.data.data;
};

const createPost = async (data: CreatePostInputType): Promise<Post> => {
    const response = await axiosInstance.post("/post/create", data);
    return response.data.data;
};

const votePost = async (postId: number, option: number) => {
    await axiosInstance.post(`/post/${postId}/vote`, { option });
};

const cancelVotePost = async (postId: number) => {
    await axiosInstance.delete(`/post/${postId}/vote`);
};

export default {
    fetchRecentPostList,
    fetchPostListByCategory,
    createPost,
    fetchPostById,
    votePost,
    cancelVotePost,
};
