import { Link, useNavigate, useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
} from "../../../../components/post/post.style.tsx";
import {
    AdminButtonGroup,
    AdminContainer,
    AnswerSection,
    AnswerTitle,
} from "../../../../components/admin/admin.style.tsx";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import Button from "../../../../components/common/button/Button.tsx";
import AdminInquiryAnswerBox from "../../../../components/inquiry/AdminInquiryAnswerBox.tsx";

function AdminInquiryDetailPage() {
    const navigate = useNavigate();
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const id = Number(inquiryId);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadInquiry = useCallback(async () => {
        try {
            const data = await adminInquiryApi.fetchInquiryById(id);
            setInquiry(data);
        } catch (error) {
            console.log(error);
            alert("문의글 상세를 불러오는데 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }, [id])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {
        });
    }, [id, loadInquiry]);

    if (isLoading) {
        return (
            <AdminContainer>
                <LoadingText>문의글 내용을 불러오는 중입니다.</LoadingText>
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
                            <span>{inquiry.user.nickname}</span>
                            <span>
                                {new Date(inquiry.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                })}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>
                <DetailContent>{inquiry.content}</DetailContent>

                {inquiry.answer ? (
                    <AnswerSection>
                        <AdminInquiryAnswerBox inquiry={inquiry} reLoad={loadInquiry} />
                    </AnswerSection>
                ) : (
                    <AnswerSection>
                        <AnswerTitle>아직 답변이 없습니다. 답변을 등록해주세요.</AnswerTitle>
                        <AdminButtonGroup $marginTop={"30px"}>
                            <Button
                                color={"warning"}
                                variant={"contained"}
                                onClick={() => navigate(`/admin/inquiry/${id}/answer`)}>
                                답변 달기
                            </Button>
                        </AdminButtonGroup>
                    </AnswerSection>
                )}

                <AdminButtonGroup $marginTop={"30px"}>
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
