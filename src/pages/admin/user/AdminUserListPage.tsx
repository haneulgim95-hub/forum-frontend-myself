import { useEffect, useState } from "react";
import { Role, type User } from "../../../types/user.type.ts";
import adminUserApi from "../../../api/admin/user/adminUserApi.ts";
import {
    AdminButtonGroup,
    AdminContainer,
    AdminLoadingText,
    AdminPageHeader,
    AdminTable,
    AdminTableWrapper,
    AdminTd,
    AdminTh,
    AdminTitle,
} from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { Link } from "react-router";
import Badge from "../../../components/common/badge/Badge.tsx";
import { FiEdit, FiTrash } from "react-icons/fi";
import Card from "../../../components/common/card/Card.tsx";

function AdminUserListPage() {
    const [list, setList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const SIZE = 20;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / SIZE);

    const loadUsers = async (page: number) => {
        try {
            const result = await adminUserApi.fetchUserList(page, SIZE);
            setList(result.list);
            setTotal(result.total);
        } catch (error) {
            console.log(error);
            alert("유저 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadUsers(page).then(() => {});
    }, [page]);

    const handleDelete = async (id: number) => {
        if (!confirm("정말 이 유저를 삭제(탈퇴) 처리 하시겠습니까?")) {
            return;
        }

        try {
            await adminUserApi.deleteUser(id);
            alert("사용자 정보가 성공적으로 삭제되었습니다.");
            loadUsers(page).then(() => {});
        } catch (error) {
            console.log(error);
            alert("사용자 삭제 중 오류가 발생했습니다.");
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>사용자 관리</AdminTitle>
                <Button color={"primary"} variant={"contained"} as={Link} to={"/admin/user/create"}>
                    + 사용자 추가
                </Button>
            </AdminPageHeader>
            <Card>
                {loading ? (
                    <AdminLoadingText>불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"5%"}>ID</AdminTh>
                                    <AdminTh $width={"15%"}>아이디</AdminTh>
                                    <AdminTh $width={"15%"}>이름 (닉네임)</AdminTh>
                                    <AdminTh $width={"20%"}>이메일</AdminTh>
                                    <AdminTh $width={"10%"}>권한</AdminTh>
                                    <AdminTh $width={"10%"}>상태</AdminTh>
                                    <AdminTh $width={"15%"}>가입일</AdminTh>
                                    <AdminTh $width={"10%"}>관리</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={8}
                                            style={{ textAlign: "center", padding: "100px" }}>
                                            등록된 유저가 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>{item.username}</AdminTd>
                                        <AdminTd>
                                            {item.name}
                                            <br />
                                            <small>{item.nickname}</small>
                                        </AdminTd>
                                        <AdminTd>{item.email}</AdminTd>
                                        <AdminTd>
                                            <Badge
                                                color={
                                                    item.role === Role.ADMIN ? "error" : "primary"
                                                }>
                                                {item.role === Role.ADMIN ? "관리자" : "일반"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            <Badge color={item.deletedAt ? "default" : "success"}>
                                                {item.deletedAt ? "탈퇴" : "정상"}
                                            </Badge>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString()}
                                        </AdminTd>
                                        <AdminTd>
                                            <AdminButtonGroup $align={"left"}>
                                                <Button
                                                    color={"primary"}
                                                    variant={"icon"}
                                                    as={Link}
                                                    to={`/admin/user/${item.id}`}>
                                                    <FiEdit size={18} />
                                                </Button>
                                                {!item.deletedAt && (
                                                    <Button
                                                        color={"primary"}
                                                        variant={"icon"}
                                                        onClick={() => handleDelete(item.id)}>
                                                        <FiTrash size={18} />
                                                    </Button>
                                                )}
                                            </AdminButtonGroup>
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}
                {total > 0 && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "20px",
                        }}>
                        <Button
                            color={"primary"}
                            variant={"text"}
                            disabled={page === 1}
                            onClick={() => handlePageChange(page - 1)}>
                            이전
                        </Button>
                        <Button
                            color={"primary"}
                            variant={"text"}
                            disabled={page === totalPage}
                            onClick={() => {
                                handlePageChange(page + 1);
                            }}>
                            다음
                        </Button>
                    </div>
                )}
            </Card>
        </AdminContainer>
    );
}

export default AdminUserListPage;
