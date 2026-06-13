import { useLocation, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import {
    type InquiryAnswerInputType,
    inquiryAnswerSchema,
} from "../../../../schemas/inquiry/inquiryAnswerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { useEffect } from "react";

function AdminInquiryAnswerPage() {
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const id = Number(inquiryId);
    const navigate = useNavigate();
    const location = useLocation();
    const { isEdit = false, existingAnswer = "" } = location.state || {};

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.updateAnswerInquiry(id, input);
            alert("답변을 성공적으로 등록했습니다.");
            navigate(`/admin/inquiry/${inquiryId}`);
        } catch (error) {
            console.log("답변등록 실패: ", error);
            alert("답변을 등록하는 중 오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        reset({
            answer: existingAnswer || "",
        });
    }, [existingAnswer, reset]);

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>
                    {isEdit ? "1:1문의 답변 수정" : "1:1문의 답변 등록"}
                </AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <TextareaGroup
                        label={"답변 내용"}
                        id={"answer"}
                        errorMessage={errors.answer?.message}
                        registerObj={register("answer")}
                        placeholder={"답변 내용을 입력해주세요."}
                    />
                    <AdminButtonGroup>
                        <Button
                            type={"button"}
                            color={"error"}
                            variant={"text"}
                            onClick={() => navigate(`/admin/inquiry/${inquiryId}`)}>
                            취소
                        </Button>
                        <Button
                            color={"secondary"}
                            variant={"contained"}
                            type={"submit"}
                            disabled={isSubmitting}>
                            {isEdit ? "답변 수정" : "답변 등록"}
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminInquiryAnswerPage;
