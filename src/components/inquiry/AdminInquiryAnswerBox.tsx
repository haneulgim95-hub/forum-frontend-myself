import type { Inquiry } from "../../types/inquiry.type.ts";
import {
    AdminButtonGroup,
    AnswerContent,
    AnswerDisplay,
    AnswerHeader,
} from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";
import adminInquiryApi from "../../api/admin/adminInquiryApi.ts";
import { useNavigate } from "react-router";

interface Props {
    inquiry: Inquiry;
    reLoad: () => Promise<void>;
}

function AdminInquiryAnswerBox({ inquiry, reLoad }: Props) {
    const navigate = useNavigate();
    const handleDeleteAnswer = async () => {
        if (!confirm("답변을 정말로 취소하시겠습니까?")) return;
        try {
            await adminInquiryApi.deleteAnswerInquiry(inquiry.id);
            alert("답변을 성공적으로 삭제했습니다");
            await reLoad();
        } catch (error) {
            console.log(error);
            alert("답변을 취소하는 중 오류가 발생했습니다.");
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
            <AnswerContent>{inquiry.answer}</AnswerContent>
            <AdminButtonGroup>
                <Button
                    color={"warning"}
                    variant={"contained"}
                    onClick={() => navigate(`/admin/inquiry/${inquiry.id}/answer`, {
                        state: {
                            isEdit: true,
                            existingAnswer: inquiry.answer,
                        }
                    })}>
                    수정
                </Button>
                <Button color={"error"} variant={"contained"} onClick={handleDeleteAnswer}>
                    삭제
                </Button>
            </AdminButtonGroup>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;
