"use client";

import { useCreatePost } from "../create/useCreatePost";

export function CreatePostForm() {
    const { submit, errors, register, serverError, isLoading } = useCreatePost();
    return (
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface-raised p-6 shadow-soft">
            {serverError && (
                <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {serverError}
                </p>
            )}
            <form onSubmit={submit} className="flex flex-col gap-4">
                <div className="space-y-1.5">
                    <label htmlFor="title" className="text-sm font-medium text-text-primary">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        autoComplete="off"
                        placeholder="Give your post a title"
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                        {...register("title")}
                    />
                    {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="text" className="text-sm font-medium text-text-primary">
                        Content
                    </label>
                    <textarea
                        id="text"
                        rows={4}
                        placeholder="What's on your mind?"
                        className="w-full resize-none rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                        {...register("text")}
                    />
                    {errors.text && <p className="text-sm text-red-600">{errors.text.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="image" className="text-sm font-medium text-text-primary">
                        Image <span className="text-text-tertiary">(optional)</span>
                    </label>
                    <input
                        id="image"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-surface-sunken file:px-3 file:py-2 file:text-sm file:font-medium file:text-text-primary hover:file:bg-border"
                        {...register("image")}
                    />
                    {errors.image && <p className="text-sm text-red-600">{errors.image.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-700 hover:shadow-lift disabled:opacity-50"
                >
                    {isLoading ? "Publishing..." : "Publish post"}
                </button>
            </form>
        </div>
    );
}
