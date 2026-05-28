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
        ],
    },
]);

export default router;
