import { baseApi } from "@/app/baseApi"
import type { Profile } from "@/features/profile/api"
import { loginType } from "./schema"

// Keep in sync with backend: backend/src/auth/schema.py LoginOut
export type LoginResponse = {
    message: string;
    user: Profile;
}

// api
const loginApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            login: build.mutation<LoginResponse, loginType>({
                query: (body: loginType) => ({
                    url: "/auth/login", body: body, method: "POST"
                }),
                invalidatesTags: ["Profile"],
            })
        }
    },
})
export const { useLoginMutation } = loginApi
