"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useLikePostMutation, useUnlikePostMutation } from "../api";

type LikeButtonProps = {
    postId: number;
    likes: number;
    liked: boolean;
    onLikedChange: (liked: boolean) => void;
};

function getRequestStatus(error: unknown): unknown {
    return (error as { status?: unknown })?.status;
}

export function LikeButton({ postId, likes, liked, onLikedChange }: LikeButtonProps) {
    const [likePost, { isLoading: isLiking }] = useLikePostMutation();
    const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();
    const [displayLikes, setDisplayLikes] = useState(likes);
    const busy = isLiking || isUnliking;

    useEffect(() => {
        setDisplayLikes(likes);
    }, [likes]);

    const handleToggle = async () => {
        if (busy) return;
        const newLiked = !liked;
        const previousLikes = displayLikes;

        onLikedChange(newLiked);
        setDisplayLikes(newLiked ? displayLikes + 1 : displayLikes - 1);

        if (liked) {
            try {
                await unlikePost(postId).unwrap();
            } catch (error: unknown) {
                if (getRequestStatus(error) === 404) {
                    onLikedChange(false);
                    return;
                }
                onLikedChange(liked);
                setDisplayLikes(previousLikes);
                return;
            }
            return;
        }
        try {
            await likePost(postId).unwrap();
        } catch (error: unknown) {
            if (getRequestStatus(error) === 409) {
                onLikedChange(true);
                return;
            }
            onLikedChange(liked);
            setDisplayLikes(previousLikes);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleToggle}
                disabled={busy}
                aria-label={liked ? "Unlike post" : "Like post"}
                aria-pressed={liked}
            >
                <Heart className={liked ? "size-6 fill-red-500 text-red-500" : "size-6 text-neutral-600"} />
            </button>
            <span className="text-sm text-neutral-600">{displayLikes}</span>
        </div>
    );
}
