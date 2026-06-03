import { useCallback, useEffect, useState } from "react";
import type { Post } from "../../../types/post.type.ts";
import postApi from "../../../api/user/postApi.ts";
import { useNavigate, useParams } from "react-router";
import {
    DetailContent,
    DetailHeader,
    DetailInfo,
    DetailTitle,
    DetailWrapper,
    LoadingText,
    PostContainer,
} from "../../../components/post/post.style.tsx";
import { AdminButtonGroup } from "../../../components/admin/admin.style.tsx";
import Button from "../../../components/common/button/Button.tsx";
import { useAuthStore } from "../../../stores/auth/authStore.ts";
import PostReply from "../../../components/post/PostReply.tsx";

function PostDetailPage() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [post, setPost] = useState<Post | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);


    const loadPost = useCallback(async () => {
        try {
            const data = await postApi.fetchPostById(Number(postId));
            setPost(data);
        } catch (error) {
            console.log("PostDetailPage error", error);
            alert("게시글 상세를 불러오는 중 에러가 발생했습니다.");
            navigate(-1);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, postId]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPost().then(() => {});
    }, [postId, loadPost]);

    if (isLoading) {
        return (
            <PostContainer>
                <LoadingText>글 내용을 불러오는 중입니다...</LoadingText>
            </PostContainer>
        )
    }

    if (!post) return;



    return (
        <PostContainer>
            <DetailWrapper>
                <DetailHeader>
                    <DetailTitle>{post.title}</DetailTitle>
                    <DetailInfo>
                        <div className={"left-info"}>
                            <span>
                                <b>{post.user.nickname}</b>
                            </span>
                            <span>
                                {new Date(post.createdAt).toLocaleString("ko-kr", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        <div className={"right-info"}>
                            <span>조회 {post.views}</span>
                        </div>
                    </DetailInfo>
                </DetailHeader>

                <DetailContent>{post.content}</DetailContent>

                <PostReply post={post} loadPost={loadPost}/>

                <AdminButtonGroup style={{marginTop: "40px"}}>
                    <Button color={"secondary"} variant={"contained"} onClick={() => navigate(-1)}>
                        목록으로
                    </Button>
                    {user?.id === post.user.id && (
                        <>
                            <Button color={"warning"} variant={"contained"}>
                                수정
                            </Button>
                            <Button color={"error"} variant={"contained"}>
                                삭제
                            </Button>
                        </>
                    )}
                </AdminButtonGroup>
            </DetailWrapper>
        </PostContainer>
    );
}

export default PostDetailPage;
