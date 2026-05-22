import { useForm } from "react-hook-form";
import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    AuthContainer,
    AuthFormBox,
    AuthFormCard,
    AuthRootErrorMessage,
    AuthSubTitle,
    AuthTitle,
} from "../../../components/auth/auth.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import axiosInstance from "../../../api/axiosInstance.ts";
import { useNavigate } from "react-router";
import axios from "axios";
import InputGroup from "../../../components/common/input/InputGroup.tsx";
import { useAuthStore } from "../../../stores/auth/authStore.ts";

function SignInPage() {
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignInInputType>({
        resolver: zodResolver(signInSchema),
        mode: "onBlur",
    });

    const onSubmit = async (data: SignInInputType) => {
        try {
            const response = await axiosInstance.post("/user/login", data);
            // 결과는 response.data에 담긴다
            // data = {
            //      message: "로그인에 성공했습니다.",
            //      data: {
            //              user: { id: 1, username: "abc", name: "홍길동"},
            //              token: string
            //      }
            // }

            const { user, token } = response.data.data;

            login(user, token);

            alert("로그인에 성공했습니다.");
            navigate("/");
        } catch (error) {
            let errorMessage = "로그인 중 오류가 발생했습니다.";
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || errorMessage;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setError("root", { message: errorMessage });
        }
    }

    return (
        <AuthContainer>
            <AuthFormCard onSubmit={handleSubmit(onSubmit)}>
                <AuthTitle>로그인</AuthTitle>
                <AuthSubTitle>다시 오신 것을 환영합니다!</AuthSubTitle>

                <AuthFormBox>
                    <InputGroup
                        label={"아이디"}
                        id={"username"}
                        errorMessage={errors.username?.message}
                        registerObj={register("username")}
                        placeholder={"아이디를 입력해주세요."}
                    />
                    <InputGroup
                        label={"비밀번호"}
                        id={"password"}
                        errorMessage={errors.password?.message}
                        registerObj={register("password")}
                        type={"password"}
                        placeholder={"비밀번호를 입력해주세요."}
                    />
                </AuthFormBox>
                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}
                <Button
                    type={"submit"}
                    fullWidth={true}
                    color={"primary"}
                    variant={"contained"}
                    disabled={isSubmitting}>
                    회원가입
                </Button>
            </AuthFormCard>
        </AuthContainer>
    );
}

export default SignInPage;
