import type { UseFormRegisterReturn } from "react-hook-form";
import Select from "./Select.tsx";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { ErrorMessage, Label, StyledInputGroup } from "../group/Group.tsx";

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    id?: string;
    errorMessage?: string;
    registerObj?: UseFormRegisterReturn;
    children: ReactNode;
}

function SelectGroup({label, id, errorMessage, registerObj, children, ...props}: Props) {
    return <StyledInputGroup>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Select id={id} {...props} $hasError={!!errorMessage} {...registerObj}>{children}</Select>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </StyledInputGroup>
}

export default SelectGroup;