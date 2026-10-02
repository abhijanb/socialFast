import type { Metadata } from "next";
import { CreatePostForm } from "@/features/post/components/CreatePostForm";

export const metadata: Metadata = {
    title: "Create Post",
    description: "Publish a new post",
};

export default function CreatePostPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center bg-surface px-4 py-10">
            <div className="mb-8 text-center">
                <h1 className="font-display text-3xl font-normal italic text-text-primary">
                    Create post
                </h1>
                <p className="mt-2 text-sm text-text-secondary">
                    Share something with your feed
                </p>
            </div>
            <div className="flex w-full justify-center animate-slide-up">
                <CreatePostForm />
            </div>
        </div>
    );
}
