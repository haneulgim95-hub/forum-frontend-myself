import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type InquiryInputType, inquirySchema } from "../../../../schemas/inquiry/inquirySchema.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import { useEffect, useState } from "react";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import inquiryApi from "../../../../api/user/inquiryApi.ts";
import axios from "axios";

function MyInquiryEditPage() {
    const navigate = useNavigate();
    const { inquiryId } = useParams<{ inquiryId: string }>();
    const [ isLoading, setIsLoading ] =  useState(true);

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<InquiryInputType>({
        resolver: zodResolver(inquirySchema),
        mode: "onBlur",
    });

    const onSubmit = async (input: InquiryInputType) => {
        try {
            const result = await inquiryApi.updateInquiry(Number(inquiryId), input);
            alert("문의글을 성공적으로 수정했습니다.");
            navigate(`/my/inquiry/${result.id}`);
        } catch (error) {
            console.log("문의글 수정 실패: ",error);
            if (axios.isAxiosError(error)) {
                setError("root", { message: error.response?.data?.message });
            }
            setError("root", { message: "공지사항 업데이트에 실패했습니다." });
        }
    };

    useEffect(() => {
        const loadInquiry = async () => {
            if (!inquiryId) return;
            try {
                const result = await inquiryApi.fetchMyInquiryById(Number(inquiryId));

                reset({
                    title: result.title,
                    content: result.content,
                })
            } catch (error) {
                console.log(error);
                alert("존재하지 않거나 삭제된 공지사항입니다.");
                navigate("/my/inquiry");
            }finally {
                setIsLoading(false);
            }
        };
        loadInquiry().then(()=> {});
    }, [inquiryId, navigate, reset]);

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>문의글 수정</AdminTitle>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminForm onSubmit={handleSubmit(onSubmit)}>
                        <InputGroup
                            label={"문의 제목"}
                            id={"title"}
                            errorMessage={errors.title?.message}
                            registerObj={register("title")}
                        />
                        <TextareaGroup
                            label={"문의 본문(내용)"}
                            id={"content"}
                            errorMessage={errors.content?.message}
                            registerObj={register("content")}
                        />
                        <div style={{ width: "100%", gap: "32px" }}>
                            {errors.root && (
                                <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                            )}
                            <AdminButtonGroup>
                                <Button
                                    type={"button"}
                                    color={"secondary"}
                                    variant={"text"}
                                    onClick={() => navigate(`/my/inquiry/${inquiryId}`)}>
                                    취소
                                </Button>
                                <Button
                                    type={"submit"}
                                    color={"primary"}
                                    variant={"contained"}
                                    disabled={isSubmitting}>
                                    {isSubmitting ? "저장 중" : "수정"}
                                </Button>
                            </AdminButtonGroup>
                        </div>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default MyInquiryEditPage;
