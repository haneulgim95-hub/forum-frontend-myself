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
import { useAuthStore } from "../../stores/auth/authStore.ts";
import Button from "../../components/common/button/Button.tsx";
import Pagination from "../../components/common/pagination/Pagination.tsx";

function PostListPage() {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [list, setList] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const page = Number(searchParams.get("page")) || 1;
    const size = Number(searchParams.get("size")) || 20;
    const [total, setTotal] = useState(0);
    const totalPage = Math.ceil(total / size);
    const { isLoggedIn } = useAuthStore();

    useEffect(() => {
        const loadList = async () => {
            try {
                const data = await postApi.fetchPostListByCategory(Number(categoryId), page, size);
                console.log(data);
                console.log(data.list);
                setList(data.list);
                setTotal(data.total);
            } catch (error) {
                console.log(error);
                alert("게시글 목록을 불러오는데 실패했습니다.");
            } finally {
                setIsLoading(false);
            }
        };
        loadList().then(() => {});
    }, [categoryId, page, size]);

    const handlePageChange = (page: number) => {
        searchParams.set("page", String(page));
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
                {isLoading ? (
                    <LoadingText>게시글을 불러오는 중입니다..</LoadingText>
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
                                <tr>
                                    <BoardTd colSpan={5} style={{ padding: "100px 0" }}>
                                        아직 작성된 게시글이 없습니다. 척 글을 남겨보세요!
                                    </BoardTd>
                                </tr>
                            )}
                            {list.map(item => (
                                <tr key={item.id}>
                                    <BoardTd>{item.id}</BoardTd>
                                    <BoardTd>
                                        <Link to={`/post/${item.id}`}>{item.title}</Link>
                                    </BoardTd>
                                    <BoardTd>{item.user.nickname}</BoardTd>
                                    <BoardTd>
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
