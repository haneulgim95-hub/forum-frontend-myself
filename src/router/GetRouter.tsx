import {createBrowserRouter} from "react-router";
import MainLayout from "../layouts/MainLayout.tsx";
import HomePage from "../pages/HomePage.tsx";
import SignInPage from "../pages/auth/signin/SignInPage.tsx";
import SignUpPage from "../pages/auth/signup/SignUpPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout/>,
        children: [
            { index:true, element: <HomePage/>},
            { path: "auth", children: [
                    { path: "signin", element: <SignInPage/>},
                    { path: "signup", element: <SignUpPage/>}
                ]}
        ]
    }
]);

export default router;