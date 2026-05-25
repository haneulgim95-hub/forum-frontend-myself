import {
    type AdminCreateCategoryInputType,
    adminCreateCategorySchema,
} from "../../../../schemas/admin/category/adminCategoryCreateSchema.ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import adminCategoryApi from "../../../../api/admin/adminCategoryApi.ts";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import Button from "../../../../components/common/button/Button.tsx";

function AdminCategoryCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCreateCategoryInputType>({
        resolver: zodResolver(adminCreateCategorySchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: AdminCreateCategoryInputType) => {
        try {
            await adminCategoryApi.createCategory(data);
            alert("카테고리를 성공적으로 추가했습니다.");
            navigate("/admin/category");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                setError("name", { message: "이미 존재하는 카테고리 명입니다." });
            } else {
                alert("카테고리 생성 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 카테고리 추가</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)}>
                    <InputGroup
                        id={"name"}
                        label={"카테고리 이름"}
                        registerObj={register("name")}
                        placeholder={"추가할 카테고리명을 입력하세요(최대 50자)"}
                        errorMessage={errors.name?.message}
                    />
                    <AdminButtonGroup>
                        <Button color={"primary"} variant={"text"} as={Link} to={"/admin/category"}>
                            취소
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"contained"}
                            disabled={isSubmitting}
                            type={"submit"}>
                            등록
                        </Button>
                    </AdminButtonGroup>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminCategoryCreatePage;
