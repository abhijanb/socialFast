import { baseApi } from "@/app/baseApi"
import type { Profile } from "@/features/profile/api"

// Keep in sync with backend: backend/src/auth/router.py register -> RegisterOut

// api
const registerApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            register: build.mutation<Profile, FormData>({
                query: (body: FormData) => ({
                    url: "/auth/register", body: body, method: "POST"
                })
            })
        }
    },
})
export const { useRegisterMutation } = registerApi
