import { baseApi } from "@/app/baseApi"
import { registerType } from "./schema"

// api
const registerApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            register: build.mutation<any, registerType>({
                query: (body: registerType) => ({
                    url: "/auth/register", body: body, method: "POST"
                })
            })
        }
    },
})
export const { useRegisterMutation } = registerApi
