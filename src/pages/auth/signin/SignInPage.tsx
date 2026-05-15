import { useForm } from "react-hook-form";
import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
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

function SignInPage() {
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

            localStorage.setItem("accessToken", token);

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
                <AuthSubTitle>다시 오신것을 환영합니다!</AuthSubTitle>
                <AuthFormBox>
                    <InputGroup>
                        <Label htmlFor={"username"}>아이디</Label>
                        <Input
                            {...register("username")}
                            id={"username"}
                            placeholder={"4자 이상 필요"}
                            $hasError={!!errors.username}
                        />
                        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"password"}>비밀번호</Label>
                        <Input
                            type="password"
                            {...register("password")}
                            id={"password"}
                            placeholder={"6자 이상 필요"}
                            $hasError={!!errors.password}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputGroup>
                </AuthFormBox>

                {errors.root && <AuthRootErrorMessage>{errors.root.message}</AuthRootErrorMessage>}

                <Button color={"primary"} variant={"contained"} type={"submit"} fullwidth={true} disabled={isSubmitting}>
                    로그인
                </Button>
            </AuthFormCard>
        </AuthContainer>
    );
}

export default SignInPage;

const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Label = styled.label`
    font-size: 14px;
    font-weight: 800;
    color: ${props => props.theme.colors.text.default};
`;

const Input = styled.input<{ $hasError: boolean }>`
    width: 100%;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    border: 1px solid
        ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.divider)};
    border-radius: 8px;
    font-size: 15px;
    color: ${props => props.theme.colors.text.default};
    transition: all 0.5s;

    &::placeholder {
        color: ${props => props.theme.colors.text.disabled};
    }

    &:focus {
        border: 1px solid
            ${props => (props.$hasError ? props.theme.colors.error : props.theme.colors.primary)};
    }
`;

const ErrorMessage = styled.span`
    font-size: 13px;
    color: ${props => props.theme.colors.error};
    font-weight: 500;
`;
