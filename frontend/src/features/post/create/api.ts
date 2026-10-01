import { baseApi } from "@/app/baseApi"

export type Post = {
    id: number;
    text: string;
    title: string | null;
    image: string | null;
    user_id: number;
    likes: number;
}

export type PostPage = {
    items: Post[];
    next_cursor: number | null;
};

export type PostQuery = {
    cursor?: number | null;
    limit?: number;
};

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
            }),
            getPosts: build.query<PostPage, PostQuery>({
                query: ({ cursor, limit }: PostQuery) => {
                    // RTK Query serializes via URLSearchParams, so `null`
                    // would become `?cursor=null` and FastAPI would reject it
                    // with 422 int_parsing. Omit null/undefined so a missing
                    // cursor means "first page" (`cursor=None` on backend).
                    const params: Record<string, number> = {};
                    if (cursor != null) params.cursor = cursor;
                    if (limit != null) params.limit = limit;
                    return {
                        url: "/post/",
                        params,
                    };
                },
                providesTags: ["Post"],
            }),
        }
    },
})
export const { useCreatePostMutation, useGetPostsQuery } = postApi
