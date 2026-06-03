import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.ts";
import replyApi from "../../api/user/replyApi.ts";
import Button from "../common/button/Button.tsx";
import { ReplyContainer, ReplyForm, ReplyTitle } from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import { useCallback, useEffect, useState } from "react";
import type { Reply } from "../../types/reply.type.ts";
import { useSearchParams } from "react-router";
import Pagination from "../common/pagination/Pagination.tsx";
import { LoadingText } from "./post.style.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const { isLoggedIn } = useAuthStore();
    const [list, setList] = useState<Reply[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 10;
    const [total, setTotal] = useState<number>(0);
    const totalPage = Math.ceil(total / size);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        mode: "onBlur",
    });

    const loadList = useCallback(async () => {
        try {
            const result = await replyApi.fetchRepliesByPostId(postId, page, size);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log("댓글목록조회실패: ", error);
            alert("댓글 목록을 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [page, postId, size]);

    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
            await loadList();
        } catch (error) {
            console.log("댓글 등록 실패: ", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        reset({
            postId,
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadList().then(() => {});
    }, [loadList, postId, reset]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <ReplyContainer>
            <ReplyTitle>
                <LuMessageSquare size={28} />
                댓글 <span className={"count"}>0</span>
            </ReplyTitle>
            <ReplyForm onSubmit={handleSubmit(onSubmit)}>
                <div style={{ flex: 1 }}>
                    <TextareaGroup
                        style={{ minHeight: "40px" }}
                        placeholder={
                            isLoggedIn
                                ? "토론에 대한 의견을 남겨주세요"
                                : "로그인 후 댓글을 작성할 수 있습니다."
                        }
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                        disabled={!isLoggedIn || isSubmitting}
                    />
                </div>
                <Button
                    disabled={!isLoggedIn || isSubmitting}
                    style={{ minWidth: "100px" }}
                    color={isLoggedIn ? "primary" : "secondary"}
                    variant={"contained"}
                    type={"submit"}>
                    {isSubmitting ? "등록 중..." : "댓글 등록"}
                </Button>
            </ReplyForm>
            {isLoading ? (
                <LoadingText>댓글 목록을 불러오는중..</LoadingText>
            ) : (
                <div>
                    {list.map(item => (<div key={item.id} style={{display: "flex", justifyContent: "space-between"}}>
                        <p>{item.content}</p>
                        <span>{item.user.nickname}</span>
                    </div>))}
                </div>
            )}

            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                />
            )}
        </ReplyContainer>
    );
}

export default PostReply;
