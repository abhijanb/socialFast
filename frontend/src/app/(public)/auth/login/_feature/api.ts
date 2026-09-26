import { baseApi } from "@/app/baseApi"
import { loginType } from "./schema"

// api
const loginApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            login: build.mutation<any, loginType>({
                query: (body: loginType) => ({
                    url: "/auth/login", body: body, method: "POST"
                })
            })
        }
    },
})
export const { useLoginMutation } = loginApi
