import type { Metadata } from "next";
import { CreatePostForm } from "../_feature/CreatePostForm";

export const metadata: Metadata = {
    title: "Create Post",
    description: "Publish a new post",
};

export default function CreatePostPage() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center bg-neutral-50 px-4 py-10">
            <h1 className="text-xl font-semibold">Create post</h1>
            <p className="mt-1 text-sm text-neutral-500">Share something with your feed.</p>
            <div className="mt-6 flex w-full justify-center">
                <CreatePostForm />
            </div>
        </div>
    );
}
