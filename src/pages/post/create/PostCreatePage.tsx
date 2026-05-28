import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    type CreatePostInputType,
    createPostSchema,
} from "../../../schemas/post/createPostSchema.ts";
import { useNavigate, useParams } from "react-router";
import {
    FormDivider,
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
    VoteFieldsFlex,
    VoteSectionDescription,
    VoteSectionTitle,
} from "../../../components/post/post.style.tsx";
import { GiCrossedSwords } from "react-icons/gi";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../components/common/textarea/TextareaGroup.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import postApi from "../../../api/user/postApi.ts";
import { useEffect } from "react";

function PostCreatePage() {
    const navigate = useNavigate();
    const { categoryId } = useParams<{ categoryId: string}>();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<CreatePostInputType>({
        resolver: zodResolver(createPostSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        if (categoryId) {
            reset({
                categoryId: Number(categoryId),
            })
        }
    },[categoryId, reset])

    const onSubmit = async (input: CreatePostInputType) => {
        try {
            await postApi.createPost(input);
            alert("게시글이 성공적으로 작성되었습니다.");
            navigate(`/category/${categoryId}`);
        } catch (error) {
            console.log(error);
            alert("게시글 등록에 실패했습니다.");
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    <GiCrossedSwords size={26} style={{ color: "#EF4444" }} />
                    대난투 등록 <small>새로운 토론 주제 던지기</small>
                </PostTitle>
            </PostPageHeader>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    placeholder={"예시) 짜장면 vs 짬뽕, 일생일대의 선택은?"}
                    label={"토론 제목"}
                    id={"title"}
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />
                <TextareaGroup
                    placeholder={
                        "자신의 의견을 지지해줄 근거와 함께 토론 주제를 상세히 작성해주세요."
                    }
                    label={"토론 발제 (본문)"}
                    id={"content"}
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                />
                <FormDivider />
                <VoteSectionTitle>
                    <GiCrossedSwords size={18} />
                    실시간 대난투 투표 설정 <small>(선택사항)</small>
                </VoteSectionTitle>
                <VoteSectionDescription>
                    항목을 입력하면 상세 페이지에 실시간 투표 선택지가 생성됩니다.
                </VoteSectionDescription>
                <VoteFieldsFlex>
                    <InputGroup
                        wrap={true}
                        placeholder={"예시) 평생 짜장면 먹기"}
                        label={"1번 선택지 항목"}
                        id={"option1Text"}
                        errorMessage={errors.option1Text?.message}
                        registerObj={register("option1Text")}
                    />
                    <InputGroup
                        wrap={true}
                        placeholder={"예시) 평생 짬뽕 먹기"}
                        label={"2번 선택지 항목"}
                        id={"option2Text"}
                        errorMessage={errors.option2Text?.message}
                        registerObj={register("option2Text")}
                    />
                </VoteFieldsFlex>

                <AdminButtonGroup>
                    <Button color={"success"} variant={"text"} onClick={() => navigate(-1)}>
                        취소
                    </Button>
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        type={"submit"}
                        disabled={isSubmitting}>
                        등록
                    </Button>
                </AdminButtonGroup>
            </FormWrapper>
        </PostContainer>
    );
}

export default PostCreatePage;
