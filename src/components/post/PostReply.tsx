import replyApi from "../../api/user/replyApi.ts";
import {
    EmptyMessage,
    ReplyContainer,
    ReplyList,
    ReplyTitle,
} from "./reply.style.tsx";
import { LuMessageSquare } from "react-icons/lu";
import { useCallback, useEffect, useState } from "react";
import type { Reply } from "../../types/reply.type.ts";
import ReplyPagination from "../common/pagination/ReplyPagination.tsx";
import ReplyForm from "./ReplyForm.tsx";
import ReplyItem from "./ReplyItem.tsx";

interface Props {
    postId: number;
}

function PostReply({ postId }: Props) {
    const [list, setList] = useState<Reply[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const size = 10;
    const [total, setTotal] = useState(0);
    const totalPage = Math.max(1, Math.ceil(total / size));

    const loadList = useCallback(
        async (page: number) => {
            try {
                const result = await replyApi.getRepliesByPostId(postId, page, size);
                setList(result.list);
                setTotal(result.total);
                setPage(page);
            } catch (error) {
                console.log("댓글 목록 조회 조회 중 에러 발생: ", error);
            } finally {
                setIsLoading(false);
            }
        },
        [postId],
    );

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadList(1).then(() => {});
    }, [loadList]);

    return (
        <ReplyContainer>
            <ReplyTitle>
                <LuMessageSquare size={28} />
                댓글 <span className={"count"}>0</span>
            </ReplyTitle>

            <ReplyForm postId={postId} loadList={loadList} />

            <ReplyList>
                {isLoading ? (
                    <EmptyMessage>댓글을 불러오는 중입니다.</EmptyMessage>
                ) : list.length === 0 ? (
                    <EmptyMessage>가장 먼저 토론에 참여해보세요!</EmptyMessage>
                ) : (
                    list.map(item => (
                        <ReplyItem key={item.id} item={item} loadList={loadList}/>
                    ))
                )}
            </ReplyList>

            <ReplyPagination currentPage={page} totalPage={totalPage} onPageChange={loadList} />
        </ReplyContainer>
    );
}

export default PostReply;
