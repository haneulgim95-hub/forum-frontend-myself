import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Inquiry } from "../../../../types/inquiry.type.ts";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../../components/post/post.style.tsx";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import { AdminButtonGroup } from "../../../../components/admin/admin.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function MyInquiryDetailPage() {
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const navigate = useNavigate();
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadInquiry = async () => {
            try {
                const result = await inquiryApi.fetchMyInquiryById(Number(inquiryId));
                setInquiry(result);
            } catch (error) {
                console.log(error);
                alert("문의글을 불러오는 중 오류가 발생했습니다.");
                navigate(-1);
            } finally {
                setIsLoading(false);
            }
        };
        loadInquiry().then(() => {});
    }, [inquiryId, navigate]);

    const handleDelete = async () => {
        try {
            if (!confirm("정말 이 문의글을 삭제 하시겠습니까?")) return;

            await inquiryApi.deleteInquiry(Number(inquiryId));
            alert("문의글 삭제가 완료 되었습니다.");
            navigate("/my/inquiry");
        } catch (error) {
            console.log(error);
            alert("문의글 삭제를 진행 중 오류가 발생했습니다.");
        }
    };

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>문의글을 불러오는 중...</LoadingText>
            </PostContainer>
        );
    }

    if (!inquiry) return;

    return (
        <PostContainer>
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
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{inquiry.content}</DetailContent>


                <AdminButtonGroup style={{ marginTop: "40px" }}>
                    <Button
                        color={"secondary"}
                        variant={"contained"}
                        onClick={() => navigate("/my/inquiry")}>
                        목록으로
                    </Button>
                    {inquiry.answers.length === 0 && (
                        <>
                            <Button
                                color={"warning"}
                                variant={"contained"}
                                onClick={() =>
                                    navigate(`/my/inquiry/edit/${inquiryId}`, {
                                        state: { inquiry },
                                    })
                                }>
                                수정
                            </Button>
                            <Button color={"error"} variant={"contained"} onClick={handleDelete}>
                                삭제
                            </Button>
                        </>
                    )}
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default MyInquiryDetailPage;
