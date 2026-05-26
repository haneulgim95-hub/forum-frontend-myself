import type { InputHTMLAttributes } from "react";
import Input from "./Input.tsx";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";

interface Props extends InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    id?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
    wrap?: boolean;
}

function InputGroup({label, id, errorMessage, registerObj, wrap, ...props}: Props) {
    return (
        <StyledInputGroup $wrap={wrap}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Input id={id} {...props} $hasError={!!errorMessage} {...registerObj}></Input>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledInputGroup>
    );
}

export default InputGroup;
