"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/core/store";
import { useGetProfileQuery } from "../profile/api";
import { selectAuthUser, setUser } from "./slice";

// Auth lives in an httpOnly cookie (backend sets it on login),
// so the guard hydrates the store from GET /auth/me and
// redirects to login when that query fails with 401.
export function useAuthGuard() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectAuthUser);
    const { data: profile, isLoading, isError } = useGetProfileQuery();

    useEffect(() => {
        if (profile) {
            dispatch(setUser(profile));
        }
    }, [profile, dispatch]);

    useEffect(() => {
        if (!isLoading && isError) {
            router.replace("/auth/login");
        }
    }, [isLoading, isError, router]);

    return { user: profile ?? user, isLoading, isError };
}
