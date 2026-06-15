import { useForm } from "react-hook-form";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import { useLocation, useNavigate, useParams } from "react-router";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import {
    FormWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../../components/post/post.style.tsx";
import { useEffect, useState } from "react";
import Button from "../../../../components/common/button/Button.tsx";
import type { Inquiry } from "../../../../types/inquiry.type.ts";

function MyInquiryEditPage() {
    const location = useLocation();
    const state = location.state as { inquiry: Inquiry } | null;
    const {inquiryId} = useParams<{inquiryId: string}>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryInputType) => {
        try {
            await inquiryApi.updateInquiry(Number(inquiryId), input);
            alert("문의글을 성공적으로 수정했습니다.");
            navigate(`/my/inquiry/${inquiryId}`);
        } catch (error) {
            console.log(error);
            alert("문의글을 수정하는 중 에러가 발생했습니다.");
        }
    };

    useEffect(() => {
        // 💡 안전장치: 만약 새로고침 등으로 state가 유실되었다면 상세페이지로 튕궈내거나
        // 여기서 다시 fetch해오는 로직을 작성할 수 있습니다. 우선은 안전하게 처리!
        if (state?.inquiry) {
            reset({
                title: state.inquiry.title,
                content: state.inquiry.content,
            });
            setIsLoading(false); // 💡 핵심: 데이터 매핑이 끝나면 로딩을 해제합니다!
        } else {
            alert("잘못된 접근이거나 데이터가 유실되었습니다.");
            navigate(`/my/inquiry/${inquiryId}`);
        }
    }, [state, reset, navigate, inquiryId]);


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
