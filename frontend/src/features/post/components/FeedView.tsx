"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useGetPostsQuery } from "@/features/post/create/api";
import { EmptyState } from "@/components/EmptyState";
import { PostCardSkeleton } from "@/components/Skeleton";
import { useInfiniteScroll } from "@/core/useInfiniteScroll";
import { PostCard } from "./PostCard";

const PAGE_SIZE = 20;
// Cap the entrance stagger so later pages don't wait seconds to animate in.
const MAX_STAGGER_INDEX = 6;

export function FeedView() {
  const [cursor, setCursor] = useState<number | null>(null);
  const { data, error, isLoading, isFetching } = useGetPostsQuery({
    cursor,
    limit: PAGE_SIZE,
  });

  const posts = data?.items ?? [];
  const hasMore = data?.next_cursor != null;

  const loadMore = () => {
    if (isFetching || data?.next_cursor == null) return;
    setCursor(data.next_cursor);
  };

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    enabled: hasMore && !isFetching,
    onLoadMore: loadMore,
  });

  const showEmpty = !isLoading && !error && posts.length === 0;

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

        {showEmpty && (
          <EmptyState
            title="Your feed is quiet"
            description="Be the first to share something — create a post and start the conversation."
          />
        )}

        {posts.map((post, index) => (
          <PostCard
            key={post.id}
            post={post}
            index={Math.min(index, MAX_STAGGER_INDEX)}
          />
        ))}

        {/* Sentinel: the next page loads as soon as this scrolls into view. */}
        {hasMore && <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />}

        {isFetching && !isLoading && (
          <div className="flex items-center justify-center gap-2 py-4 text-sm text-text-tertiary">
            <LoaderCircle className="size-4 animate-spin" />
            Loading more posts…
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="py-6 text-center text-sm text-text-tertiary">
            You&apos;re all caught up
          </p>
        )}
      </div>
    </div>
  );
}
