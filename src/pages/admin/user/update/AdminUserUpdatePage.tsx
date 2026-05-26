import { useForm } from "react-hook-form";
import {
    type AdminUpdateUserInputType,
    adminUpdateUserSchema,
} from "../../../../schemas/admin/user/adminUpdateUserSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminForm,
    AdminLoadingText,
    AdminPageHeader,
    AdminTitle,
} from "../../../../components/admin/admin.style.tsx";
import Card from "../../../../components/common/card/Card.tsx";
import InputGroup from "../../../../components/common/input/InputGroup.tsx";
import SelectGroup from "../../../../components/common/select/SelectGroup.tsx";
import { Gender, Role } from "../../../../types/user.type.ts";
import { AuthRootErrorMessage } from "../../../../components/auth/auth.style.tsx";
import Button from "../../../../components/common/button/Button.tsx";
import adminUserApi from "../../../../api/admin/user/adminUserApi.ts";
import axios from "axios";
import { useEffect, useState } from "react";

function AdminUserUpdatePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    const {
        register,
        handleSubmit,
        setError,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<AdminUpdateUserInputType>({
        resolver: zodResolver(adminUpdateUserSchema),
        mode: "onBlur",
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const result = await adminUserApi.fetchUserById(Number(id));
                reset({
                    username: result.username,
                    name: result.name,
                    nickname: result.nickname,
                    email: result.email,
                    gender: result.gender,
                    role: result.role,
                    phoneNumber: result.phoneNumber ?? undefined,
                    birthdate: result.birthdate ? result.birthdate.split("T")[0] : undefined,
                });
            } catch (error) {
                console.log(error);
                alert("사용자 정보를 불러오는 도중 오류가 발생했습니다.");
                navigate("/amdin/user");
            } finally {
                setLoading(false);
            }
        };
        loadUser().then(() => {});
    }, [id, navigate, reset]);

    const onSubmit = async (data: AdminUpdateUserInputType) => {
        try {
            await adminUserApi.updatedUser(Number(id), data);
            alert("사용자 정보의 업데이트가 완료되었습니다.");
            navigate("/admin/user");
        } catch (error) {
            const errorMessage = "사용자 정보를 수정하는데 오류가 발생했습니다.";
            if (axios.isAxiosError(error)) {
                setError("root", { message: error.response?.data?.message || errorMessage });
                return;
            }
            console.log(error);
            setError("root", { message: "사용자 정보의 업데이트에 실패했습니다." });
        }
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 수정</AdminTitle>
            </AdminPageHeader>
            <Card>
                {loading ? (
                    <AdminLoadingText>데이터를 불러오는 중...</AdminLoadingText>
                ) : (
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
                                <Button
                                    color={"primary"}
                                    variant={"text"}
                                    as={Link}
                                    to={"/admin/user"}>
                                    취소
                                </Button>
                                <Button
                                    color={"primary"}
                                    variant={"contained"}
                                    disabled={isSubmitting}
                                    type={"submit"}>
                                    수정
                                </Button>
                            </AdminButtonGroup>
                        </div>
                    </AdminForm>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserUpdatePage;
