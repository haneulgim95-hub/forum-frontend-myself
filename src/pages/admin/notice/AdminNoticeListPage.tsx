import { useEffect, useState } from "react";
import type { Notice } from "../../../types/notice.type.ts";
import { Link, useSearchParams } from "react-router";
import noticeApi from "../../../api/user/noticeApi.ts";
import {
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
import Card from "../../../components/common/card/Card.tsx";
import Pagination from "../../../components/common/pagination/Pagination.tsx";

function AdminNoticeListPage() {
    const [list, setList] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const size = 20;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadList = async () => {
            try {
                const result = await noticeApi.getNoticeList(page, size);
                setList(result.list);
                setTotal(result.total);
            } catch (error) {
                console.log("공지사항 목록 조회 실패: ", error);
                alert("공지사항 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadList().then(() => {});
    }, [page, size]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <AdminContainer>
            <AdminPageHeader>
                <AdminTitle>공지사항 관리</AdminTitle>
                <Button
                    color={"primary"}
                    variant={"contained"}
                    as={Link}
                    to={"/admin/notice/create"}>
                    + 공지사항 등록
                </Button>
            </AdminPageHeader>

            <Card>
                {isLoading ? (
                    <AdminLoadingText>불러오는 중...</AdminLoadingText>
                ) : (
                    <AdminTableWrapper>
                        <AdminTable>
                            <thead>
                                <tr>
                                    <AdminTh $width={"10%"}>번호</AdminTh>
                                    <AdminTh>제목</AdminTh>
                                    <AdminTh $width={"20%"}>작성일</AdminTh>
                                </tr>
                            </thead>
                            <tbody>
                                {list.length === 0 && (
                                    <tr>
                                        <AdminTd
                                            colSpan={3}
                                            style={{ textAlign: "center", padding: "100px 0" }}>
                                            등록된 공지사항이 없습니다.
                                        </AdminTd>
                                    </tr>
                                )}
                                {list.map(item => (
                                    <tr key={item.id}>
                                        <AdminTd>{item.id}</AdminTd>
                                        <AdminTd>
                                            <Link to={`/admin/notice/${item.id}`}>
                                                {item.title}
                                            </Link>
                                        </AdminTd>
                                        <AdminTd>
                                            {new Date(item.createdAt).toLocaleString("ko-kr", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                            })}
                                        </AdminTd>
                                    </tr>
                                ))}
                            </tbody>
                        </AdminTable>
                    </AdminTableWrapper>
                )}

                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                />
            </Card>
        </AdminContainer>
    );
}

export default AdminNoticeListPage;
