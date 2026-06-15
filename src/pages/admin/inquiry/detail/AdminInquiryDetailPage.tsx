import { Link, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AnswerItem,
    AnswerSection,
} from "../../../../components/admin/admin.style.tsx";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
} from "../../../../components/post/post.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";
import AdminInquiryAnswerForm from "../../../../components/inquiry/AdminInquiryAnswerForm.tsx";
import type { Answer } from "../../../../types/answer.type.ts";

function AdminInquiryDetailPage() {
    const navigate = useNavigate();
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [editingAnswer, setEditingAnswer] = useState<Answer | null>(null);

    const loadInquiry = useCallback(async () => {
        try {
            const result = await adminInquiryApi.fetchInquiryById(Number(inquiryId));
            setInquiry(result);
        } catch (error) {
            console.log(error);
            alert("문의글을 조회하는데 실패했습니다.");
            navigate("/admin/inquiry");
        } finally {
            setIsLoading(false);
        }
    }, [inquiryId, navigate])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [loadInquiry]);

    if (isLoading) {
        return (
            <AdminContainer>
                <LoadingText>문의글을 불러오는 중입니다.</LoadingText>
            </AdminContainer>
        );
    }

    if (!inquiry) return;

    return (
        <AdminContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{inquiry.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                {new Date(inquiry.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                            <span>{inquiry.user.nickname}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{inquiry.content}</DetailContent>

                <AnswerSection>
                    {inquiry.answers.length > 0 ? (
                        <AdminInquiryAnswerBox
                            inquiry={inquiry}
                            reload={loadInquiry}
                            onEditClick={}
                        />
                    ) : (
                        <AnswerItem>아직 등록된 답변이 없습니다. 답변을 남겨주세요!</AnswerItem>
                    )}
                    <AdminInquiryAnswerForm inquiryId={inquiry.id} reload={loadInquiry} />
                </AnswerSection>

                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        as={Link}
                        to={"/admin/inquiry"}>
                        목록으로
                    </Button>
                </AdminButtonGroup>
            </DetailWrapper>
        </AdminContainer>
    );
}

export default AdminInquiryDetailPage;
