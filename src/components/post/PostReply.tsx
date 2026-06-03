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
import { useEffect } from "react";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const { isLoggedIn } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateReplyInputType>({
        resolver: zodResolver(createReplySchema),
        mode: "onBlur",
    });


    const onSubmit = async (data: CreateReplyInputType) => {
        try {
            await replyApi.createReply(postId, data.content);
            reset();
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
        </ReplyContainer>
    );
}

export default PostReply;
