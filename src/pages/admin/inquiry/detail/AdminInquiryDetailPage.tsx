import { useCallback, useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import { Link, useNavigate, useParams } from "react-router";
import adminInquiryApi from "../../../../api/admin/adminInquiryApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
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

function AdminInquiryDetailPage() {
    const navigate = useNavigate();
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const id = Number(inquiryId);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    const loadInquiry = useCallback(async () => {
        try {
            const data = await adminInquiryApi.fetchInquiryByID(id);
            setInquiry(data);
        } catch (error) {
            console.log(error);
            alert("문의글 상세를 조회하는데 실패했습니다.");
            navigate("/admin/inquiry");
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadInquiry().then(() => {});
    }, [id, setInquiry, navigate, setIsLoading, loadInquiry]);

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

                <AnswerSection>
                    {inquiry.answer && !isEdit ? (
                        <AdminInquiryAnswerBox
                            inquiry={inquiry}
                            reload={loadInquiry}
                            setIsEdit={setIsEdit}
                        />
                    ) : (
                        <AdminInquiryAnswerForm
                            inquiry={inquiry}
                            reLoad={loadInquiry}
                            isEdit={isEdit}
                            setIsEdit={setIsEdit}
                        />
                    )}
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
