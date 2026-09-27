import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/core/store";
import { baseApi } from "@/app/baseApi";
import { logout as logoutAction } from "../slice";
import { useLogoutMutation } from "./api";

export function useLogout() {
    const [trigger, { isLoading }] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const logout = async () => {
        try {
            await trigger().unwrap();
        } finally {
            dispatch(logoutAction());
            dispatch(baseApi.util.resetApiState());
            router.replace("/auth/login");
        }
    };

    return { logout, isLoading };
}
