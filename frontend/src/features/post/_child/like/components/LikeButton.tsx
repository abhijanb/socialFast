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
    const [animating, setAnimating] = useState(false);
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
        setAnimating(true);
        setTimeout(() => setAnimating(false), 300);

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
                className="rounded-full p-1.5 transition-colors hover:bg-surface-sunken"
            >
                <Heart
                    className={`size-5 transition-all duration-200 ${
                        liked
                            ? "fill-red-500 text-red-500"
                            : "text-text-tertiary hover:text-red-400"
                    } ${animating ? "animate-heart-pop" : ""}`}
                />
            </button>
            <span className="text-sm font-medium text-text-secondary tabular-nums">
                {displayLikes}
            </span>
        </div>
    );
}
