import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/core/getImageUrl";
import type { Post } from "@/features/post/create/api";
import { LikeButton } from "@/features/post/_child/like/components/LikeButton";

export function PostCard({ post }: { post: Post }) {
    const imageSrc = post.image ? getImageUrl(post.image) : null;
    const [liked, setLiked] = useState(false);

    return (
        <article className="group overflow-hidden rounded-2xl border border-border bg-surface-raised shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5">
            <div className="px-5 pt-5">
                {post.title && (
                    <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                        {post.title}
                    </h2>
                )}
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{post.text}</p>
            </div>
            {imageSrc && (
                <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={post.title || "Post image"}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 512px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                </div>
            )}
            <div className="flex items-center px-5 py-4">
                <LikeButton postId={post.id} likes={post.likes} liked={post.liked_by_user} onLikedChange={setLiked} />
            </div>
        </article>
    );
}
