import { useEffect, useState } from "react";
import type { Post } from "../../types/post.type.ts";
import { Link, useParams, useSearchParams } from "react-router";
import postApi from "../../api/user/postApi.ts";
import {
    BoardTable,
    BoardTd,
    BoardTh,
    BoardWrapper,
    LoadingText,
    PostContainer,
    PostPageHeader,
    PostTitle,
} from "../../components/post/post.style.tsx";
import Button from "../../components/common/button/Button.tsx";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import Pagination from "../../components/common/pagination/Pagination.tsx";

function PostListPage() {
    const { isLoggedIn } = useAuthStore();
    const { categoryId } = useParams();
    const [list, setList] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const size = Number(searchParams.get("size")) || 20;
    const page = Number(searchParams.get("page") || 1);
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await postApi.fetchPostListByCategory(Number(categoryId), page, size);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.log(error);
                alert("게시글을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        window.scrollTo({ top: 0, behavior: "smooth" });

        loadList().then(() => {});
    }, [page, size, categoryId]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", page.toString());
        setSearchParams(searchParams);
    };

    return (
        <PostContainer>
            <PostPageHeader>
                <PostTitle>
                    게시판 <small>총 {total}개의 글</small>
                </PostTitle>
                {isLoggedIn && (
                    <Button
                        color={"primary"}
                        variant={"contained"}
                        as={Link}
                        to={`/post/create/${categoryId}`}>
                        글쓰기
                    </Button>
                )}
            </PostPageHeader>
            <BoardWrapper>
                {loading ? (
                    <LoadingText>게시글을 불러오는 중입니다.</LoadingText>
                ) : (
                    <BoardTable>
                        <thead>
                            <tr>
                                <BoardTh $width={"10%"}>번호</BoardTh>
                                <BoardTh>제목</BoardTh>
                                <BoardTh $width={"15%"}>작성자</BoardTh>
                                <BoardTh $width={"15%"}>작성일</BoardTh>
                                <BoardTh $width={"10%"}>조회수</BoardTh>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length === 0 && (
                                <tr className="empty-row">
                                    <BoardTd colSpan={5} style={{ padding: "100px 0" }}>
                                        아직 작성된 게시글이 없습니다. 첫 글을 남겨보세요!
                                    </BoardTd>
                                </tr>
                            )}
                            {list.map(item => (
                                <tr key={item.id}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd className={"title-cell"}>
                                        <Link to={`/post/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>{item.user.nickname}</BoardTd>
                                    <BoardTd>
                                        {/*
                                            Date 클래스의 메서드 중 toLocaleString()은
                                            해당 날짜를 사용자의 지역 시간에 맞게 문자열로 반환하는 메서드
                                             매개변수를 생략하면 자동으로 보는 사용자에 맞춰 제공됨
                                            .toLocaleString(해당 지역, 옵션 객체)
                                        */}
                                        {new Date(item.createdAt).toLocaleString("ko-kr", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </BoardTd>
                                    <BoardTd>{item.views}</BoardTd>
                                </tr>
                            ))}
                        </tbody>
                    </BoardTable>
                )}
            </BoardWrapper>
            {total > 0 && (
                <Pagination
                    currentPage={page}
                    totalPage={totalPage}
                    onPageChange={handlePageChange}
                />
            )}
        </PostContainer>
    );
}

export default PostListPage;
