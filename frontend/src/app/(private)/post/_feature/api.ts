import { baseApi } from "@/app/baseApi"

// api
const postApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            // Backend expects multipart/form-data (text/title as Form, image as File).
            createPost: build.mutation<unknown, FormData>({
                query: (formData: FormData) => ({
                    url: "/post/", body: formData, method: "POST"
                })
            })
        }
    },
})
export const { useCreatePostMutation } = postApi
