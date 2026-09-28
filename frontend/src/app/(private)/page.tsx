"use client"
import { useGetPostsQuery } from "@/features/post/create/api"
import { PostCard } from "@/features/post/components/PostCard"
import { useState } from "react"


export default function FeedPage() {
  const [cursor, setCursor] = useState<number | null>(null)
  const { data, error, isLoading } = useGetPostsQuery({
    cursor: cursor ?? undefined,
    limit: 20,
  })
  return (
    <div className="flex min-h-[80vh] flex-col items-center bg-neutral-50 px-4 py-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        {/* Feed content */}
        {isLoading && <p className="text-center text-sm text-neutral-500">Loading...</p>}
        {error && <p className="text-center text-sm text-red-600">Error loading posts</p>}
        {!isLoading && !error && data?.items.length === 0 && (
          <p className="text-center text-sm text-neutral-500">No posts yet.</p>
        )}
        {data && data.items.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {/* Pagination controls */}
        {data?.next_cursor != null && (
          <button
            onClick={() => setCursor(data?.next_cursor ?? null)}
            className="self-center rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-medium text-neutral-700 shadow-sm hover:bg-neutral-100"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  )
}