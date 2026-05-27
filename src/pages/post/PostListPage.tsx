import { useEffect, useState } from "react";
import type { Post } from "../../types/post.type.ts";
import { useNavigate, useParams, useSearchParams } from "react-router";
import postApi from "../../api/user/postApi.ts";

function PostListPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [list, setList] = useState<Post[]>();

    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const SIZE = 20;
    const page = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const loadList = async () => {
            try {
                const result = await postApi.fetchPostListByCategory(Number(id), page, SIZE);
                setList(result.list);
            } catch (error) {
                console.log(error);
                alert("글 목록을 조회하는데 실패하였습니다.");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        loadList().then(()=> {});
    },[page])

    return <></>
}

export default PostListPage;