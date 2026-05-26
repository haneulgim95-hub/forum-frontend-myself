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
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
    type AdminCreateUserInputType,
    adminCreateUserSchema,
} from "../../../../schemas/admin/user/adminCreateUserSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender, Role } from "../../../../types/user.type.ts";
import SelectGroup from "../../../../components/common/select/SelectGroup.tsx";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import adminUserApi from "../../../../api/admin/user/adminUserApi.ts";
import axios from "axios";

function AdminUserCreatePage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<AdminCreateUserInputType>({
        resolver: zodResolver(adminCreateUserSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: AdminCreateUserInputType) => {
        try {
            await adminUserApi.createUser(data);
            alert("사용자를 성공적으로 추가했습니다.");
            navigate("/admin/user");
        } catch (error) {
            console.log(error);
            let errorMessage = "회원가입 중 오류가 발생했습니다";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError("root", { message: errorMessage });
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>새 사용자 추가</AdminTitle>
            </AdminPageHeader>
            <Card>
                <AdminForm onSubmit={handleSubmit(onSubmit)} $wrap={true}>
                    <InputGroup
                        wrap={true}
                        id={"username"}
                        label={"아이디"}
                        registerObj={register("username")}
                        placeholder={"4자 이상 필요"}
                        errorMessage={errors.username?.message}
                    />
                    <InputGroup
                        wrap={true}
                        id={"password"}
                        label={"비밀번호"}
                        registerObj={register("password")}
                        placeholder={"6자 이상 필요"}
                        errorMessage={errors.password?.message}
                        type="password"
                    />
                    <InputGroup
                        wrap={true}
                        id={"name"}
                        label={"이름"}
                        registerObj={register("name")}
                        errorMessage={errors.name?.message}
                    />
                    <InputGroup
                        wrap={true}
                        id={"nickname"}
                        label={"닉네임"}
                        registerObj={register("nickname")}
                        placeholder={"닉네임을 2자 이상 입력해주세요."}
                        errorMessage={errors.nickname?.message}
                    />
                    <InputGroup
                        wrap={true}
                        id={"email"}
                        label={"이메일"}
                        registerObj={register("email")}
                        errorMessage={errors.email?.message}
                        type="email"
                    />
                    <InputGroup
                        wrap={true}
                        id={"phoneNumber"}
                        label={"전화번호"}
                        registerObj={register("phoneNumber")}
                        errorMessage={errors.phoneNumber?.message}
                        type={"tel"}
                    />
                    <InputGroup
                        wrap={true}
                        id={"birthdate"}
                        label={"생년월일"}
                        registerObj={register("birthdate")}
                        errorMessage={errors.birthdate?.message}
                        type={"date"}
                    />
                    <SelectGroup
                        wrap={true}
                        label={"성별"}
                        id={"gender"}
                        errorMessage={errors.gender?.message}
                        registerObj={register("gender")}>
                        <option value={""}>성별을 선택해주세요</option>
                        <option value={Gender.MALE}>남성</option>
                        <option value={Gender.FEMALE}>여성</option>
                    </SelectGroup>
                    <SelectGroup
                        wrap={true}
                        label={"종류"}
                        id={"role"}
                        errorMessage={errors.role?.message}
                        registerObj={register("role")}>
                        <option value={""}>종류를 선택해주세요</option>
                        <option value={Role.ADMIN}>관리자</option>
                        <option value={Role.USER}>일반 사용자</option>
                    </SelectGroup>
                    <div style={{ width: "100%", gap: "32px" }}>
                        {errors.root && (
                            <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>
                        )}

                        <AdminButtonGroup>
                            <Button color={"primary"} variant={"text"} as={Link} to={"/admin/user"}>
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
                    </div>
                </AdminForm>
            </Card>
        </AdminContainer>
    );
}

export default AdminUserCreatePage;
