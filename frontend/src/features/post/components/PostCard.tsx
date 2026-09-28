import Image from "next/image";
import { getImageUrl } from "@/core/getImageUrl";
import type { Post } from "@/features/post/create/api";

export function PostCard({ post }: { post: Post }) {
    const imageSrc = post.image ? getImageUrl(post.image) : null;
    return (
        <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
            <div className={`px-4 pt-4 ${imageSrc ? "" : "pb-4"}`}>
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
        </article>
    );
}
