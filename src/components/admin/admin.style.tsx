import styled from "styled-components";

export const AdminContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

export const AdminPageHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
`;

export const AdminTitle = styled.h2`
    font-size: 24px;
    font-weight: 700;
`;

export const AdminLoadingText = styled.div`
    text-align: center;
    padding: 40px;
    color: ${props => props.theme.colors.text.disabled};
`;

export const AdminTableWrapper = styled.div`
    overflow-x: auto;
`;

export const AdminTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const AdminTh = styled.th<{ $width?: string }>`
    width: ${props => props.$width};
    text-align: left;
    padding: 12px 16px;
    background-color: ${props => props.theme.colors.background.default};
    color: ${props => props.theme.colors.text.disabled};
    font-size: 13px;
    font-weight: 600;
    border-bottom: 2px solid ${props => props.theme.colors.divider};
`;

export const AdminTd = styled.td`
    padding: 16px;
    font-size: 14px;
    border-bottom: 1px solid ${props => props.theme.colors.divider};
    vertical-align: middle;
    color: ${props => props.theme.colors.text.disabled};
`;

export const AdminForm = styled.form<{ $wrap?: boolean }>`
    display: flex;
    flex-direction: ${props => (props.$wrap ? "row" : "column")};
    flex-wrap: ${props => (props.$wrap ? "wrap" : "nowrap")};
    gap: 32px;
`;

export const AdminButtonGroup = styled.div<{ $align?: "left" | "right" | "center", $marginTop?: string}>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({ $align = "right" }) =>
        $align === "left" ? "flex-start" : $align === "right" ? "flex-end" : "center"};
    margin-top: ${({$marginTop = "30px"}) => $marginTop};
`;

export const AnswerSection = styled.div`
    margin-top: 32px;
    padding: 24px;
    background-color: ${props => props.theme.colors.background.default};
    border-radius: 8px;

    .status-badge {
        margin-right: 12px;
        vertical-align: middle;
    }
`;

export const AnswerDisplay = styled.div`
    display: flex;
    flex-direction: column;
    
    .answer-content {
    padding-top: 16px
`;

export const AnswerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${props => props.theme.colors.divider};
    padding-bottom: 16px;

    h4 {
        font-size: 18px;
        color: ${props => props.theme.colors.primary};
        font-weight: 700;
    }

    small {
        color: ${props => props.theme.colors.secondary};
        font-size: 14px;
    }
`;

export const AnswerTitle = styled.h3`
    font-size: 16px;
    font-weight: 500;
`;

export const AnswerContent = styled.div`
    padding: 32px 0;
    line-height: 1.8;
    white-space: pre-wrap;
    word-break: break-all;
`;