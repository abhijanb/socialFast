"use client";

import { useCreatePost } from "./useCreatePost";

export function CreatePostForm() {
    const { submit, errors, register, serverError, isLoading } = useCreatePost();
    return (
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            {serverError && <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
            <form onSubmit={submit} className="flex flex-col gap-3">
                <label htmlFor="title" className="text-sm font-medium text-neutral-700">Post Title</label>
                <input id="title" type="text" autoComplete="off" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900" {...register("title")} />
                {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}

                <label htmlFor="text" className="text-sm font-medium text-neutral-700">Post Content</label>
                <textarea id="text" rows={4} className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900" {...register("text")} />
                {errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}

                <label htmlFor="image" className="text-sm font-medium text-neutral-700">Post Image</label>
                <input id="image" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-neutral-700" {...register("image")} />
                {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}

                <button type="submit" disabled={isLoading} className="mt-2 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">
                    {isLoading ? "Publishing..." : "Publish post"}
                </button>
            </form>
        </div>
    );
}
