import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type CreateReplyInputType,
    createReplySchema,
} from "../../schemas/reply/createReplySchema.ts";
import replyApi from "../../api/user/replyApi.ts";
import Button from "../common/button/Button.tsx";
import {
    EmptyMessage,
    ReplyContainer,
    ReplyContent,
    ReplyForm,
    ReplyHeader,
    ReplyItem,
    ReplyList,
    ReplyTitle,
} from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import { useCallback, useEffect, useState } from "react";
import type { Reply } from "../../types/reply.type.ts";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const { isLoggedIn, user } = useAuthStore();
    const [list, setList] = useState<Reply[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const size = 10;
    const [total, setTotal] = useState(0);
    const totalPage = Math.max(1,Math.ceil(total / size));

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        mode: "onBlur",
    });

    const loadList = useCallback(async (page: number) => {
        try {
            const result = await replyApi.getRepliesByPostId(postId, page, size);
            setList(result.list);
            setTotal(result.total);
            setPage(page);
        } catch (error) {
            console.log("댓글 목록 조회 조회 중 에러 발생: ", error);
        } finally {
            setIsLoading(false);
        }
    }, [postId])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadList(1).then(()=>{});
    }, [loadList]);


    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
            await loadList(1);
        } catch (error) {
            console.log("댓글 등록 실패: ", error);
            alert("댓글 작성 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        reset({
            postId,
        })
    }, [postId, reset])

    const handleDeleteReply = async (replyId: number) => {
        if (!confirm("정말 이 댓글을 삭제 하시겠습니까?")) return;

        try {
            await replyApi.deleteReply(replyId);
            await loadList(1);
        } catch (error) {
            console.log("댓글 삭제 실패: ", error);
            alert("댓글 삭제 중 오류가 발생되었습니다.");

        }
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

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다.</EmptyMessage>
                ) : list.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해보세요!</EmptyMessage>
                ) : (
                    list.map(item => (
                        <ReplyItem key={item.id}>
                            <ReplyHeader>
                                <div className={"author-info"}>
                                    <strong>{item.user.nickname}</strong>
                                    <span className={"date"}>
                                        {new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                                {user?.id === item.userId && (
                                    <button
                                        className={"delete-btn"}
                                        onClick={() => handleDeleteReply(item.id)}>
                                        삭제
                                    </button>
                                )}
                            </ReplyHeader>
                            <ReplyContent>{item.content}</ReplyContent>
                        </ReplyItem>
                    ))
                )}
            </ReplyList>

            <ReplyPagination currentPage={page} totalPage={totalPage} onPageChange={loadList}/>
        </ReplyContainer>
    );
}

export default PostReply;
