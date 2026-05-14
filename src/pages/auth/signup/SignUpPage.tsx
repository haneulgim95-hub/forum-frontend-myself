import { useForm } from "react-hook-form";
import { type SignUpInputType, signUpSchema } from "../../../schemas/auth/signUpSchma.ts";
import { zodResolver } from "@hookform/resolvers/zod";

function SignUpPage() {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<SignUpInputType>({
        resolver: zodResolver(signUpSchema),
        mode: "onBlur"
    });

    return <></>
}

export default SignUpPage;