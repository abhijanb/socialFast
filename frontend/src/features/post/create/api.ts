import { baseApi } from "@/app/baseApi"

export type Post = {
    id: number;
    text: string;
    title: string | null;
    image: string | null;
    user_id: number;
}

// api
const postApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints(build) {
        return {
            // Backend expects multipart/form-data (text/title as Form, image as File).
            createPost: build.mutation<Post, FormData>({
                query: (formData: FormData) => ({
                    url: "/post/", body: formData, method: "POST"
                }),
                invalidatesTags: ["Post"],
            })
        }
    },
})
export const { useCreatePostMutation } = postApi
