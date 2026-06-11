import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    FormWrapper,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../../../components/post/post.style.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import { useNavigate } from "react-router";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import axios from "axios";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";

function MyInquiryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryInputType) => {
        try {
            const result = await inquiryApi.createInquiry(input);
            alert("문의글을 성공적으로 등록했습니다.");
            navigate(`/my/inquiry/${result.id}`);
        } catch (error) {
            console.log("문의글 등록 실패:", error);
            if (axios.isAxiosError(error)) {
                setError("root", { message: error.response?.data?.message });
            }
            setError("root", { message: "문의글 등록중 에러가 발생했습니다." });
        }
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    1:1 문의 등록 <small>빠른 시간 안에 답변을 드리도록 노력하겠습니다.</small>
                </PostTitle>
            </PostPageHeader>
            <FormWrapper onSubmit={handleSubmit(onSubmit)}>
                <InputGroup
                    label={"문의 제목"}
                    id={"title"}
                    placeholder={"문의 사항의 제목을 입력해주세요."}
                    errorMessage={errors.title?.message}
                    registerObj={register("title")}
                />
                <TextareaGroup
                    label={"문의 내용"}
                    id={"content"}
                    placeholder={"문의 내용을 입력해주세요."}
                    errorMessage={errors.content?.message}
                    registerObj={register("content")}
                />

                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}
                <AdminButtonGroup style={{ marginTop: "-10px" }}>
                    <Button color={"primary"} variant={"text"} onClick={() => navigate("/my/inquiry")} type={"button"}>
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

export default MyInquiryCreatePage;
