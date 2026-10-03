import { baseApi } from "@/app/baseApi"

export type Post = {
    id: number;
    text: string;
    title: string | null;
    image: string | null;
    user_id: number;
    likes: number;
    liked_by_user: boolean;
    username: string | null;
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
                // Infinite scroll keeps every loaded page in a single cache
                // entry so `merge` can append the next page instead of
                // replacing the list each time the cursor changes.
                serializeQueryArgs: ({ endpointName }) => endpointName,
                merge: (currentCache, newPage, { arg }) => {
                    // A missing cursor is the first page, so start over.
                    if (arg.cursor == null) {
                        currentCache.items = newPage.items;
                    } else {
                        // Dedupe so tag-invalidation refetches (e.g. after
                        // liking a post) don't append posts already listed.
                        const loadedIds = new Set(currentCache.items.map((post) => post.id));
                        const freshItems = newPage.items.filter((post) => !loadedIds.has(post.id));
                        currentCache.items.push(...freshItems);
                    }
                    currentCache.next_cursor = newPage.next_cursor;
                },
                // Only hit the network again when the cursor actually moves.
                forceRefetch: ({ currentArg, previousArg }) =>
                    currentArg?.cursor !== previousArg?.cursor,
                providesTags: ["Post"],
            }),
        }
    },
})
export const { useCreatePostMutation, useGetPostsQuery } = postApi
