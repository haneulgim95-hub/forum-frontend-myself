import { type PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../../stores/auth/authStore.ts";
import userApi from "../../api/user/userApi.ts";

type Props = PropsWithChildren;

function AuthProvider({ children }: Props) {
    const [isInitialized, setIsInitialized] = useState(true);
    const { logout, isLoggedIn, token } = useAuthStore();

    useEffect(() => {
        const checkAuthValidity = async () => {
            if (token && isLoggedIn) {
                try {
                    const result = await userApi.getMe();
                    useAuthStore.setState({ user: result });
                } catch (error) {
                    console.log(error);
                    logout();
                }
            }
            setIsInitialized(false);
        };
        checkAuthValidity().then(() => {});
    }, [isLoggedIn, logout, token]);

    if (isInitialized) {
        return null;
    }

    return <>{children}</>;
}

export default AuthProvider;
