import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/core/getImageUrl";
import { ProfileAvatar } from "@/features/profile/ProfileAvatar";
import type { Post } from "@/features/post/create/api";
import { LikeButton } from "@/features/post/_child/like/components/LikeButton";

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
    const imageSrc = post.image ? getImageUrl(post.image) : null;
    const [liked, setLiked] = useState(false);

    if (!imageSrc) {
        return <TextPostCard post={post} liked={liked} onLikedChange={setLiked} index={index} />;
    }

    return <ImagePostCard post={post} imageSrc={imageSrc} liked={liked} onLikedChange={setLiked} index={index} />;
}

function PostAuthor({ username }: { username: string | null }) {
    if (!username) return null;
    return (
        <div className="mb-2 flex items-center gap-2">
            <ProfileAvatar username={username} size="sm" />
            <p className="text-sm font-medium text-accent-600">
                @{username}
            </p>
        </div>
    );
}

function TextPostCard({
    post,
    liked,
    onLikedChange,
    index,
}: {
    post: Post;
    liked: boolean;
    onLikedChange: (v: boolean) => void;
    index: number;
}) {
    return (
        <article
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface-raised p-6 shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 animate-slide-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-accent-400 to-accent-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="pl-2">
                <PostAuthor username={post.username} />
                {post.title && (
                    <h2 className="font-display text-xl font-normal italic tracking-tight text-text-primary">
                        {post.title}
                    </h2>
                )}
                <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
                    {post.text}
                </p>
            </div>
            <div className="mt-5 flex items-center border-t border-border pt-4">
                <LikeButton postId={post.id} likes={post.likes} liked={post.liked_by_user} onLikedChange={onLikedChange} />
            </div>
        </article>
    );
}

function ImagePostCard({
    post,
    imageSrc,
    liked,
    onLikedChange,
    index,
}: {
    post: Post;
    imageSrc: string;
    liked: boolean;
    onLikedChange: (v: boolean) => void;
    index: number;
}) {
    return (
        <article
            className="group overflow-hidden rounded-3xl border border-border bg-surface-raised shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-0.5 animate-slide-up"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="px-5 pt-5">
                <PostAuthor username={post.username} />
                {post.title && (
                    <h2 className="text-lg font-semibold tracking-tight text-text-primary">
                        {post.title}
                    </h2>
                )}
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary line-clamp-3">
                    {post.text}
                </p>
            </div>
            <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={post.title || "Post image"}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>
            <div className="flex items-center px-5 py-4">
                <LikeButton postId={post.id} likes={post.likes} liked={post.liked_by_user} onLikedChange={onLikedChange} />
            </div>
        </article>
    );
}
