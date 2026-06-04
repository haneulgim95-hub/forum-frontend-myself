// 글 동록할때 필요한것들..
// 토큰
// title, content, categoryId, option1Text, option2Text => req.body

// 카테고리 목록을 리턴하는 함수
// 글동록을 하는 함수
// 그걸 실행하는 함수
const mockPostList = [
    {
        title: "탕수육 먹을 때 소스는?",
        option1Text: "무조건 부먹",
        option2Text: "바삭하게 찍먹",
    },
    {
        title: "아이스 아메리카노 vs 따뜻한 아메리카노",
        option1Text: "얼죽아",
        option2Text: "쩌죽따",
    },
    {
        title: "치킨 먹을 때",
        option1Text: "닭다리부터",
        option2Text: "닭가슴살부터",
    },
    {
        title: "민트초코에 대한 당신의 견해는?",
        option1Text: "신의 음식 (극호)",
        option2Text: "치약 맛(극혐)",
    },
    {
        title: "평생 한 가지만 먹어야 된다면?",
        option1Text: "평생 짜장면만 먹기",
        option2Text: "평생 짬뽕만 먹기",
    },
    {
        title: "꺳잎 논쟁, 내 연인이 친구의 깻잎을 떼어준다면?",
        option1Text: "매너일 뿐 괜찮다",
        option2Text: "절대 안됨 난리남",
    },
    {
        title: "새우 논쟁, 내 연인이 새우를 까준다면?",
        option1Text: "새우 정도야",
        option2Text: "결별 사유임",
    },
    {
        title: "출근 시간 정시 도착의 기준은?",
        option1Text: "9시 정각 문 통과",
        option2Text: "8시 50분 착석 완료",
    },
];

import { ADMIN_TOKEN, BASE_URL } from "./config.js";

const CATEGORY_LIST_URL = BASE_URL + "/category";

async function fetchCategories() {
    try {
        const response = await fetch(CATEGORY_LIST_URL);
        if (!response.ok) {
            throw new Error(`카테고리 조회 실패 : ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        return result.data; // category[]
    } catch (error) {
        console.log("카테고리 목록 조회 중 에러 발생:", error);
        return [];
    }
}

const POST_CREATE_URL = BASE_URL + "/post/create";

async function generatePosts(categoryId, count) {
    for (let i = 0; i < count; i++) {
        try {
            const topic = mockPostList[Math.floor(Math.random() * mockPostList.length)];

            const dummyData = {
                title: topic.title,
                content:
                    "이 게시글은 토론대난투 시스템을 검증하기 위해 생성된 자동화 테스트 글입니다. \n\n" +
                    "과연 여러분의 선택은 어느 쪽인가요?\n" +
                    `1번 ${topic.option1Text}과 2번 ${topic.option2Text} 중 마음에 드는 진영에 투표하고, ` +
                    "아래 댓글 창에서 논리 제압을 시작해주세요!",
                categoryId: categoryId,
                option1Text: topic.option1Text,
                option2Text: topic.option2Text,
            };

            const response = await fetch(POST_CREATE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ADMIN_TOKEN}`,
                },
                body: JSON.stringify(dummyData),
            });

            if (!response.ok) {
                throw new Error(`게시글 등록 실패 : ${response.status} ${response.statusText}`);
            }
            console.log(`[${i + 1}/ ${count}] (categoryId: ${categoryId}) 생성 성공`);
        } catch (error) {
            console.log(
                `[${i + 1}/ ${count}] (categoryId: ${categoryId}) 생성 실패`,
                error.message,
            );
        }
    }
}

async function runSeeder() {
    try {
        const count = 20;
        const categories = await fetchCategories();

        if (!categories || categories.length === 0) {
            console.log("카테고리 데이터를 불러오지 못했습니다. 시드 작업을 중단합니다.");
            return;
        }

        for (const category of categories) {
            console.log(`카테고리ID(${category.id})에 대한 게시글 생성 작업을 시작합니다.`);
            await generatePosts(category.id, count);
        }
    } catch (error) {
        console.error("시드 작업 전체 과정 중 치명적인 에러 발생:", error);
    }
}

runSeeder().then(() => {});
