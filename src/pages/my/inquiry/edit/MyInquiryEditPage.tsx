import { useForm } from "react-hook-form";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminButtonGroup,
} from "../../../../components/admin/admin.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import {
    FormWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../../components/post/post.style.tsx";
import { useEffect, useState } from "react";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import { useNavigate, useParams } from "react-router";

function MyInquiryEditPage() {
    const { inquiryId } = useParams<{inquiryId: string}>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadInquiry = async () => {
            try {
                const result = await inquiryApi.fetchMyInquiryById(Number(inquiryId));
                reset({
                    title: result.title,
                    content: result.content,
                })
            } catch (error) {
                console.log(error);
                alert("문의글을 불러오는데 실패했습니다.");
                navigate(`/my/inquiry/${inquiryId}`);
            } finally {
                setIsLoading(false);
            }
        };
        loadInquiry().then(()=>{});
    }, [inquiryId, navigate, reset, setIsLoading])

    const onSubmit = async (input: InquiryInputType) => {
        try {
            await inquiryApi.updateInquiry(Number(inquiryId), input);
            alert("문의글을 성공적으로 수정했습니다.");
            navigate(`/my/inquiry/${inquiryId}`);
        } catch (error) {
            console.log(error);
            alert("문의글을 수정하는데 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>데이터를 불러오는 중입니다.</LoadingText>
            </PostContainer>
        );
    }

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 수정 <small>등록하신 문의 내용을 수정합니다.</small>
                </PostTitle>
            </PostPageHeader>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    label={"문의 제목"}
                    id={"title"}
                    placeholder={"변경할 제목을 입력해주세요."}
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />
                <TextareaGroup
                    label={"문의 내용"}
                    id={"content"}
                    placeholder={"변경할 내용을 입력해주세요."}
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                />

                <AdminButtonGroup style={{ marginTop: "-10px" }}>
                    <Button
                        color={"primary"}
                        variant={"text"}
                        onClick={() => navigate(`/my/inquiry/${inquiryId}`)}
                        type={"button"}>
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

export default MyInquiryEditPage;
