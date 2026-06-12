import type { Inquiry } from "../../types/inquiry.type.ts";
import { AdminButtonGroup, AnswerContent, AnswerDisplay, AnswerHeader } from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
}

function AdminInquiryAnswerBox({ inquiry, reload, setIsEdit }: Props) {
    const handleDeleteAnswer = async () => {
        try {
            await adminInquiryApi.deleteInquiryAnswer(inquiry.id);
            alert("답변을 성공적으로 삭제했습니다.");
            await reload();
        } catch (error) {
            console.log(error);
            alert("답변을 삭제하는 중 오류가 발생했습니다.");
        }
    };

    return (
        <AnswerDisplay>
            <AnswerHeader>
                <h4>관리자 답변</h4>
                <small>
                    답변 일시 :{" "}
                    {inquiry.answeredAt && new Date(inquiry.answeredAt).toLocaleString()}
                </small>
            </AnswerHeader>
            <AnswerContent className={"answer-content"}>{inquiry.answer}</AnswerContent>
            <AdminButtonGroup>
                <Button color={"warning"} variant={"contained"} onClick={() => setIsEdit(true)}>
                    답변 수정
                </Button>
                <Button color={"error"} variant={"contained"} onClick={handleDeleteAnswer}>
                    답변 삭제
                </Button>
            </AdminButtonGroup>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;