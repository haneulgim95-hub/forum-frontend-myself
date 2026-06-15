import { useForm } from "react-hook-form";
import { type AnswerInputType, answerSchema } from "../../schemas/answer/answerSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import adminAnswerApi from "../../api/admin/adminAnswerApi.ts";
import { AdminButtonGroup, AdminForm } from "../admin/admin.style.tsx";
import TextareaGroup from "../common/textarea/TextareaGroup.tsx";
import Button from "../common/button/Button.tsx";

interface Props {
    inquiryId: number;
    reload: () => Promise<void>;
}

function AdminInquiryAnswerForm({ inquiryId, reload }: Props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AnswerInputType>({
        resolver: zodResolver(answerSchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: AnswerInputType) => {
        try {
            await adminAnswerApi.createAnswer(inquiryId, input);
            alert("답변을 성공적으로 등록했습니다.");
            reset();
            await reload();
        } catch (error) {
            console.log(error);
            alert("답변을 등록하는 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminForm onSubmit={handleSubmit(onSubmit)}>
            <TextareaGroup
                label={"관리자 답변 작성"}
                id={"content"}
                errorMessage={errors.content?.message}
                registerObj={register("content")}
                placeholder={"사용자에게 전달할 답변을 상세히 작성해주세요."}
            />
            <AdminButtonGroup>
                <Button color={"error"} variant={"text"} disabled={isSubmitting} type={"submit"}>
                    답변 등록{" "}
                </Button>
            </AdminButtonGroup>
        </AdminForm>
    );
}

export default AdminInquiryAnswerForm;
