import styled from "styled-components";
import type { ButtonHTMLAttributes, ElementType, ReactNode } from "react";

type ButtonColorType = "primary" | "secondary" | "success" | "error" | "warning" | "info";
type VariantType = "contained" | "text" | "icon";

const StyledButton = styled.button<{
    $color: ButtonColorType;
    $variant: VariantType;
    $fullwidth?: boolean;
}>`
    width: ${props => props.$fullwidth ? "100%" : "auto"};
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: ${props => props.$variant === "icon" ? "1" : "auto"};
    font-size: 14px;
    font-weight: 600;
    color: ${props => (props.$variant === "contained" ? "#fff" : props.theme.colors.text.default)};
    background-color: ${props =>
        props.$variant === "contained" ? props.theme.colors[props.$color] : "transparent"};
    padding: ${props => (props.$variant === "icon" ? "8px" : "8px 16px")};
    border-radius: ${props => (props.$variant === "icon" ? "50%" : "6px")};
    transition: all 0.5s;

    &:hover {
        // 밝기 조절
        filter: brightness(0.8);
        background-color: ${props =>
            props.$variant === "contained" ? undefined : props.theme.colors.background.default};
    }
`;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    color: ButtonColorType;
    variant: VariantType;
    fullWidth?: boolean;
    as?: ElementType;
    to?: string;
};

function Button({children, color, variant, fullWidth, ...props}: Props) {
    return (
        <StyledButton $color={color} $variant={variant} $fullWidth={fullWidth} {...(props as any)}>
            {children}
        </StyledButton>
    );
}

export default Button;