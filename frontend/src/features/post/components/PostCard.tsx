import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/core/getImageUrl";
import type { Post } from "@/features/post/create/api";
import { LikeButton } from "@/features/post/_child/like/components/LikeButton";

export function PostCard({ post }: { post: Post }) {
    const imageSrc = post.image ? getImageUrl(post.image) : null;
    const [liked, setLiked] = useState(false);

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className="px-4 pt-4">
                {post.title && <h2 className="text-base font-semibold text-neutral-900">{post.title}</h2>}
                <p className="mt-1 text-sm leading-relaxed text-neutral-700">{post.text}</p>
            </div>
            {imageSrc && (
                <div className="relative mt-3 aspect-[4/5] w-full overflow-hidden">
                    <Image
                        src={imageSrc}
                        alt={post.title || "Post image"}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 512px"
                        className="object-cover"
                    />
                </div>
            )}
            <div className="flex items-center px-4 py-3">
                <LikeButton postId={post.id} likes={post.likes} liked={liked} onLikedChange={setLiked} />
            </div>
        </article>
    );
}
