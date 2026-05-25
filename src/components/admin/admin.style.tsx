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

export const AdminForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

export const AdminButtonGroup = styled.div<{$align?: "left" | "right" | "center"}>`
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: ${({$align = "right"}) => $align === "left" ? "flex-start" : $align === "right" ? "flex-end" : "center" };
`;
