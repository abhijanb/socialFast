"use client"
import { useGetPostsQuery } from "@/features/post/create/api"
import { useState } from "react"


export default function FeedPage() {
  const [cursor, setCursor] = useState<number | null>(null)
  const { data, error, isLoading } = useGetPostsQuery({
    cursor: cursor ?? undefined,
    limit: 20,
  })
  return (
    <>
    {/* Feed content */}
    {isLoading && <p>Loading...</p>}
    {error && <p>Error loading posts</p>}
    {data && data.items.map((post) => (
      <div key={post.id}>
        <h2>{post.title}</h2>
        <p>{post.text}</p>
        {post.image && <img src={post.image} alt={post.title || "Post image"} />}
      </div>
    ))}
    {/* Pagination controls */}
    <button onClick={() => setCursor(data?.next_cursor ?? null)}>
      Load More
    </button>
    </>
  )
}