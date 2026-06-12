import { useForm } from "react-hook-form";
import {
    type InquiryAnswerInputType,
    inquiryAnswerSchema,
} from "../../schemas/inquiry/inquiryAnswerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";
import { AdminButtonGroup, AdminForm } from "../admin/admin.style.tsx";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import type { Inquiry } from "../../types/inquiry.type.ts";

interface Props {
    inquiry: Inquiry;
    reLoad: () => Promise<void>;
    isEdit: boolean;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
}

function AdminInquiryAnswerForm({ inquiry, reLoad, isEdit, setIsEdit }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<InquiryAnswerInputType>({
        resolver: zodResolver(inquiryAnswerSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        reset({
            answer: inquiry.answer || "",
        });
    }, [reset, inquiry]);

    const onSubmit = async (input: InquiryAnswerInputType) => {
        try {
            await adminInquiryApi.updateInquiryAnswer(inquiry.id, input);
            alert("답변을 성공적으로 등록했습니다.");
            await reLoad();
            setIsEdit(false);
        } catch (error) {
            console.log(error);
            alert("답변을 등록하는데 실패했습니다.");
        }
    };

    return (
        <AdminForm onSubmit={handleSubmit(onSubmit)}>
            <TextareaGroup
                label={"관리자 답변 작성"}
                id={"answer"}
                errorMessage={errors.answer?.message}
                registerObj={register("answer")}
                placeholder={"사용자에게 전달할 답변을 상세히 작성해주세요."}
            />
            <AdminButtonGroup>
                {isEdit && (
                    <Button color={"warning"} variant={"contained"} type={"button"} onClick={() => setIsEdit(false)}>
                        수정 취소
                    </Button>
                )}
                <Button color={"error"} variant={"text"} disabled={isSubmitting} type="submit">
                    {isEdit ? "답변 수정" : "답변 등록"}
                </Button>
            </AdminButtonGroup>
        </AdminForm>
    );
}

export default AdminInquiryAnswerForm;
