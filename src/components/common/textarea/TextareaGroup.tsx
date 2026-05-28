import type { TextareaHTMLAttributes } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";
import Textarea from "./Textarea.tsx";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    id?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
    isWrap?: boolean;
}

function TextareaGroup({ label, id, errorMessage, registerObj, isWrap, ...props }: Props) {
    return (
        <StyledInputGroup $wrap={isWrap}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <Textarea id={id} {...props} $hasError={!!errorMessage} {...registerObj}></Textarea>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </StyledInputGroup>
    );
}

export default TextareaGroup;