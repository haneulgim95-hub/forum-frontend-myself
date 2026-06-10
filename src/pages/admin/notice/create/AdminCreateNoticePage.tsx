import { useForm } from "react-hook-form";
import { type NoticeInputType, noticeSchema } from "../../../../schemas/notice/noticeSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import TextareaGroup from "../../../../components/common/textarea/TextareaGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import { Link, useNavigate } from "react-router";
import adminNoticeApi from "../../../../api/admin/adminNoticeApi.ts";

function AdminCreateNoticePage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<NoticeInputType>({
        resolver: zodResolver(noticeSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: NoticeInputType) => {
        try {
            await adminNoticeApi.createNotice(data);
            alert("공지사항을 성공적으로 등록했습니다.");
            navigate("/admin/notice");
        } catch (error) {
            console.log("공지사항 등록 실패:", error);
            alert("공지사항 등록 중 오류가 발생했습니다.");
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 공지사항 등록</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        label={"제목"}
                        id={"title"}
                        placeholder={"제목을 입력해주세요"}
                        errorMessage={errors.title?.message}
                        registerObj={register("title")}
                    />
                    <TextareaGroup
                        label={"본문(내용)"}
                        id={"content"}
                        placeholder={"내용을 입력해주세요"}
                        errorMessage={errors.content?.message}
                        registerObj={register("content")}
                    />
                    <AdminButtonGroup style={{ marginTop: "40px" }}>
                        <Button color={"primary"} variant={"text"} as={Link} to={"/admin/notice"}>
                            취소
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            type={"submit"}
                            disabled={isSubmitting}>
                            등록
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminCreateNoticePage;
