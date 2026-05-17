import { useForm } from "react-hook-form";
import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchma.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Gender } from "../../../types/user.type.ts";
import Button from "../../../components/common/button/Button.tsx";
import { useNavigate } from "react-router";
import axiosInstance from "../../../api/axiosInstance.ts";
import axios from "axios";
import {
    AuthContainer,
    AuthFormBox,
    AuthFormCard,
    AuthRootErrorMessage,
    AuthSubTitle,
    AuthTitle,
} from "../../../components/auth/auth.style.tsx";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import SelectGroup from "../../../components/common/select/SelectGroup.tsx";

function SignUpPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignUpInputType) => {
        try {
            const { passwordConfirm, ...submitData } = data;

            await axiosInstance.post("/user/create", submitData);
            // 성공을 했었을때 백엔드가 전달해준 내용은 response.data에 객체 상태로 존재함

            alert("회원가입이 완료되었습니다. 로그인을 진행해주세요.");
            navigate("/auth/signin");
        } catch (error) {
            let errorMessage = "회원가입 중 오류가 발생했습니다.";

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setError("root", { message: errorMessage });
        }
    };

    return (
        <AuthContainer>
            <AuthFormCard onSubmit={handleSubmit(onSubmit)}>
                <AuthTitle>회원가입</AuthTitle>
                <AuthSubTitle>토론 대난투에 오신것을 환영합니다.</AuthSubTitle>
                <AuthFormBox>
                    <InputGroup
                        label={"아이디"}
                        id={"username"}
                        registerObj={register("username")}
                        placeholder={"4자 이상 필요"}
                        errorMessage={errors.username?.message}
                    />
                    <InputGroup
                        label={"비밀번호"}
                        id={"password"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                        type={"password"}
                        placeholder={"6자 이상 필요"}
                    />
                    <InputGroup
                        label={"비밀번호확인"}
                        id={"passwordConfirm"}
                        errorMessage={errors.passwordConfirm?.message}
                        registerObj={register("passwordConfirm")}
                        type={"password"}
                        placeholder={"비밀번호를 한 번 더 입력해주세요."}
                    />
                    <InputGroup
                        label={"이름"}
                        id={"name"}
                        errorMessage={errors.name?.message}
                        registerObj={register("name")}
                    />
                    <InputGroup
                        label={"닉네임"}
                        id={"nickname"}
                        errorMessage={errors.nickname?.message}
                        registerObj={register("nickname")}
                        placeholder={"닉네임을 2자 이상 입력해주세요."}
                    />
                    <InputGroup
                        label={"이메일"}
                        id={"email"}
                        errorMessage={errors.email?.message}
                        registerObj={register("email")}
                        type={"email"}
                    />
                    <InputGroup
                        label={"이메일"}
                        id={"email"}
                        errorMessage={errors.email?.message}
                        registerObj={register("email")}
                        type={"email"}
                    />
                    <InputGroup
                        label={"전화번호"}
                        id={"phoneNumber"}
                        errorMessage={errors.phoneNumber?.message}
                        registerObj={register("phoneNumber")}
                        type={"tel"}
                    />
                    <InputGroup
                        label={"생년월일"}
                        id={"birthdate"}
                        errorMessage={errors.birthdate?.message}
                        registerObj={register("birthdate")}
                        type={"date"}
                    />
                    <SelectGroup
                        label={"성별"}
                        id={"gender"}
                        errorMessage={errors.gender?.message}
                        registerObj={register("gender")}>
                        <option value={""}>성별을 선택해주세요</option>
                        <option value={Gender.MALE}>남성</option>
                        <option value={Gender.FEMALE}>여성</option>
                    </SelectGroup>
                </AuthFormBox>
                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}
                <Button
                    color={"primary"}
                    variant={"contained"}
                    disabled={isSubmitting}
                    fullwidth={true}>
                    회원가입
                </Button>
            </AuthFormCard>
        </AuthContainer>
    );
}

export default SignUpPage;
