"use client"
import { useGetPostsQuery } from "@/features/post/create/api"
import { PostCard } from "@/features/post/components/PostCard"
import { useState } from "react"
import { PostCardSkeleton } from "@/components/Skeleton"
import { EmptyState } from "@/components/EmptyState"


export default function FeedPage() {
  const [cursor, setCursor] = useState<number | null>(null)
  const { data, error, isLoading } = useGetPostsQuery({
    cursor: cursor ?? undefined,
    limit: 20,
  })
  return (
    <div className="flex min-h-[80vh] flex-col items-center bg-surface px-4 py-10">
      <div className="flex w-full max-w-xl flex-col gap-6">
        {isLoading && (
          <>
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </>
        )}
        {error && (
          <p className="py-16 text-center text-sm text-red-600">Error loading posts</p>
        )}
        {!isLoading && !error && data?.items.length === 0 && (
          <EmptyState
            title="Your feed is quiet"
            description="Be the first to share something — create a post and start the conversation."
          />
        )}
        {data && data.items.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
        {data?.next_cursor != null && (
          <button
            onClick={() => setCursor(data?.next_cursor ?? null)}
            className="self-center rounded-full border border-border bg-surface-raised px-6 py-2.5 text-sm font-medium text-text-primary shadow-soft transition-all duration-200 hover:bg-surface-sunken hover:shadow-lift"
          >
            Load More
          </button>
        )}
      </div>
    </div>
  )
}
