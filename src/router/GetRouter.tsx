import { createBrowserRouter, redirect } from "react-router";
import MainLayout from "../layouts/MainLayout.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignInPage from "../pages/auth/signin/SignInPage.tsx";
import SignUpPage from "../pages/auth/signup/SignUpPage.tsx";
import AdminLayout from "../layouts/AdminLayout.tsx";
import { useAuthStore } from "../stores/auth/authStore.ts";
import { Role } from "../types/user.type.ts";
import AdminCategoryList from "../pages/admin/category/AdminCategoryList.tsx";
import AdminCategoryCreatePage from "../pages/admin/category/create/AdminCategoryCreatePage.tsx";
import AdminCategoryEditPage from "../pages/admin/category/edit/AdminCategoryEditPage.tsx";
import AdminUserListPage from "../pages/admin/user/AdminUserListPage.tsx";
import AdminUserCreatePage from "../pages/admin/user/create/AdminUserCreatePage.tsx";
import AdminUserUpdatePage from "../pages/admin/user/update/AdminUserUpdatePage.tsx";
import PostListPage from "../pages/post/PostListPage.tsx";
import PostCreatePage from "../pages/post/create/PostCreatePage.tsx";
import PostDetailPage from "../pages/post/detail/PostDetailPage.tsx";
import AdminNoticeListPage from "../pages/admin/notice/AdminNoticeListPage.tsx";
import AdminNoticeDetailPage from "../pages/admin/notice/detail/AdminNoticeDetailPage.tsx";
import AdminCreateNoticePage from "../pages/admin/notice/create/AdminCreateNoticePage.tsx";
import AdminUpdateNoticePage from "../pages/admin/notice/update/AdminUpdateNoticePage.tsx";
import NoticeListPage from "../pages/notice/NoticeListPage.tsx";
import NoticeDetailPage from "../pages/notice/detail/NoticeDetailPage.tsx";
import AdminInquiryListPage from "../pages/admin/inquiry/AdminInquiryListPage.tsx";
import MyInquiryListPage from "../pages/my/inquiry/MyInquiryListPage.tsx";
import MyInfoPage from "../pages/my/info/MyInfoPage.tsx";
import MyLayout from "../layouts/MyLayout.tsx";
import MyInquiryDetailPage from "../pages/my/inquiry/detail/MyInquiryDetailPage.tsx";
import MyInquiryEditPage from "../pages/my/inquiry/edit/MyInquiryEditPage.tsx";
import MyInquiryCreatePage from "../pages/my/inquiry/create/MyInquiryCreatePage.tsx";
import AdminInquiryDetailPage from "../pages/admin/inquiry/detail/AdminInquiryDetailPage.tsx";
import MyPasswordPage from "../pages/my/password/MyPasswordPage.tsx";
import MyWithdrawPage from "../pages/my/withdraw/MyWithdrawPage.tsx";

const adminLoader = () => {
    const { isLoggedIn, user } = useAuthStore.getState();

    if (!isLoggedIn) {
        alert("로그인을 먼저 진행해주세요.");
        redirect("/auth/signin");
    }

    if (user?.role !== Role.ADMIN) {
        alert("관리자만 접근할 수 있는 페이지입니다..");
        redirect("/");
    }
    return null;
};

const guestLoader = () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (isLoggedIn) {
        redirect("/");
    }

    return null;
};

const userLoader = () => {
    const { isLoggedIn } = useAuthStore.getState();

    if (!isLoggedIn) {
        redirect("/");
    }
    return null;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "category", children: [{ path: ":categoryId", element: <PostListPage /> }] },
            {
                path: "post",
                children: [
                    { path: "create/:categoryId", loader: userLoader, element: <PostCreatePage /> },
                    { path: ":postId", element: <PostDetailPage /> },
                ],
            },
            {
                path: "auth",
                loader: guestLoader,
                children: [
                    { path: "signin", element: <SignInPage /> },
                    { path: "signup", element: <SignUpPage /> },
                ],
            },
            {
                path: "notice",
                children: [
                    { index: true, element: <NoticeListPage /> },
                    { path: ":id", element: <NoticeDetailPage /> },
                ],
            },
            {
                path: "my",
                loader: userLoader,
                element: <MyLayout />,
                children: [
                    { index: true, element: <MyInfoPage /> },
                    { path: "password", element: <MyPasswordPage /> },
                    { path: "withdraw", element: <MyWithdrawPage /> },
                    {
                        path: "inquiry",
                        children: [
                            { index: true, element: <MyInquiryListPage /> },
                            { path: ":inquiryId", element: <MyInquiryDetailPage /> },
                            { path: "create", element: <MyInquiryCreatePage /> },
                            { path: "edit/:inquiryId", element: <MyInquiryEditPage /> },
                        ],
                    },
                ],
            },
        ],
    },
    {
        path: "/admin",
        loader: adminLoader,
        element: <AdminLayout />,
        children: [
            {
                path: "category",
                children: [
                    { index: true, element: <AdminCategoryList /> },
                    { path: "create", element: <AdminCategoryCreatePage /> },
                    { path: "edit/:id", element: <AdminCategoryEditPage /> },
                ],
            },
            {
                path: "user",
                children: [
                    { index: true, element: <AdminUserListPage /> },
                    { path: "create", element: <AdminUserCreatePage /> },
                    { path: ":id", element: <AdminUserUpdatePage /> },
                ],
            },
            {
                path: "notice",
                children: [
                    { index: true, element: <AdminNoticeListPage /> },
                    { path: ":id", element: <AdminNoticeDetailPage /> },
                    { path: "create", element: <AdminCreateNoticePage /> },
                    { path: "update/:id", element: <AdminUpdateNoticePage /> },
                ],
            },
            {
                path: "inquiry",
                children: [
                    { index: true, element: <AdminInquiryListPage /> },
                    { path: ":inquiryId", element: <AdminInquiryDetailPage /> },
                ],
            },
        ],
    },
]);

export default router;
