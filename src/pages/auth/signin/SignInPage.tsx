import { useForm } from "react-hook-form";
import { type SignInInputType, signInSchema } from "../../../schemas/auth/signInSchema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import styled from "styled-components";
import Button from "../../../components/common/button/Button.tsx";
import axiosInstance from "../../../api/axiosInstance.ts";
import {useNavigate} from "react-router";
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

    const onSubmit= async (data: SignInInputType) => {
        try {
            const response = await axiosInstance.post("/user/login", data);

            const { user, token } = response.data.data;
            localStorage.setItem("token", token);

            alert("로그인에 성공했습니다.");
            navigate("/");
        } catch(error) {
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
            <FormCard onSubmit={handleSubmit(onSubmit)}>
                <Title>로그인</Title>
                <SubTitle>다시 오신것을 환영합니다.</SubTitle>
                <FormBox>
                    <InputGroup>
                        <Label htmlFor={"username"}>아이디</Label>
                        <Input
                            id={"username"}
                            {...register("username")}
                            $hasError={!!errors.username}
                            placeholder={"아이디를 입력해주세요."}
                        />
                        {errors.username && <ErrorMessage>{errors.username.message}</ErrorMessage>}
                    </InputGroup>
                    <InputGroup>
                        <Label htmlFor={"password"}>비밀번호</Label>
                        <Input
                            type={"password"}
                            id={"password"}
                            {...register("password")}
                            $hasError={!!errors.password}
                            placeholder={"비밀번호를 입력해주세요."}
                        />
                        {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                    </InputGroup>
                </FormBox>
                {errors.root && <RootErrorMessage>{errors.root.message}</RootErrorMessage>}
                <Button color={"primary"} variant={"contained"} fullwidth={true} type={"submit"} disabled={isSubmitting}>로그인</Button>
            </FormCard>
        </AuthContainer>
    );
}

export default SignInPage;
