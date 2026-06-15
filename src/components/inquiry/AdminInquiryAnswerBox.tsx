import type { Inquiry } from "../../types/inquiry.type.ts";
import {
    AdminButtonGroup,
    AnswerContent,
    AnswerDisplay,
    AnswerHeader,
    AnswerItem,
} from "../admin/admin.style.tsx";
import Button from "../common/button/Button.tsx";
import adminAnswerApi from "../../api/admin/adminAnswerApi.ts";
import type { Dispatch, SetStateAction } from "react";

interface Props {
    inquiry: Inquiry;
    reload: () => Promise<void>;
    setIsEdit: Dispatch<SetStateAction<boolean>>;
}

function AdminInquiryAnswerBox({ inquiry, reload, setIsEdit }: Props) {
    const handleDeleteAnswer = async (answerId: number) => {
        try {
            await adminAnswerApi.deleteAnswer(answerId);
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
            </AnswerHeader>
            <AnswerContent>
                {inquiry.answers.map(item => (
                    <AnswerItem key={item.id}>
                        <h4>
                            {new Date(item.createdAt).toLocaleString("ko-kr", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            })}
                        </h4>
                        <div>{item.content}</div>
                        <AdminButtonGroup>
                            <Button
                                color={"warning"}
                                variant={"contained"}
                                onClick={() => setIsEdit(true)}>
                                답변 수정
                            </Button>
                            <Button
                                color={"error"}
                                variant={"contained"}
                                onClick={() => handleDeleteAnswer(item.id)}>
                                답변 삭제
                            </Button>
                        </AdminButtonGroup>
                    </AnswerItem>
                ))}
            </AnswerContent>
        </AnswerDisplay>
    );
}

export default AdminInquiryAnswerBox;
