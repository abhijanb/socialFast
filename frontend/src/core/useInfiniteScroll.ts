"use client";

import { useEffect, useRef } from "react";

type UseInfiniteScrollOptions = {
  /** Whether the sentinel should currently be watched. */
  enabled: boolean;
  /** Called when the sentinel scrolls into view. */
  onLoadMore: () => void;
  /** How far ahead of the viewport to trigger. */
  rootMargin?: string;
};

/**
 * Observes a sentinel element and calls `onLoadMore` when it enters the
 * viewport. Returns a ref to attach to the sentinel element.
 */
export function useInfiniteScroll<T extends HTMLElement = HTMLDivElement>({
  enabled,
  onLoadMore,
  rootMargin = "300px",
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<T | null>(null);
  const onLoadMoreRef = useRef(onLoadMore);

  // Keep the latest callback without re-creating the observer on every render.
  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !enabled) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}