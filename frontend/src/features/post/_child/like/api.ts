import { baseApi } from "@/app/baseApi";

export type LikeOut = {
    id: number;
    user_id: number;
    post_id: number;
};

const likeApi = baseApi.injectEndpoints({
    // Fast Refresh re-evaluates this module on edit while the shared baseApi
    // singleton persists, so re-injection must be allowed in dev.
    overrideExisting: true,
    endpoints: (builder) => ({
        likePost: builder.mutation<LikeOut, number>({
            query: (postId) => ({
                url: `/like/${postId}`,
                method: "POST",
            }),
            invalidatesTags: ["Post"],
        }),
        unlikePost: builder.mutation<void, number>({
            query: (postId) => ({
                url: `/like/${postId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Post"],
        }),
    }),
});

export const { useLikePostMutation, useUnlikePostMutation } = likeApi;