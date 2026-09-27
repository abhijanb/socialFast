import { baseApi } from "@/app/baseApi"

// Keep in sync with backend: backend/src/auth/schema.py RegisterOut
export type Profile = {
    id: number;
    username: string;
    email: string;
    avatar: string | null;
}

// api
const profileApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            getProfile: build.query<Profile, void>({
                query: () => "/auth/me",
                providesTags: ["Profile"],
            }),
        }
    },
})
export const { useGetProfileQuery } = profileApi
