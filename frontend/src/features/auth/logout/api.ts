import { baseApi } from "@/app/baseApi"

// Keep in sync with backend: POST backend/src/auth/router.py logout
const logoutApi = baseApi.injectEndpoints({
    overrideExisting: true,
    endpoints(build) {
        return {
            logout: build.mutation<{ message: string }, void>({
                query: () => ({
                    url: "/auth/logout",
                    method: "POST",
                }),
                invalidatesTags: ["Profile", "Post"],
            }),
        }
    },
})

export const { useLogoutMutation } = logoutApi
