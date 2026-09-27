import { useForm } from "react-hook-form";
import { createPostSchema, type CreatePostInput } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePostMutation } from "./api";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getServerMessage } from "@/core/getServerMessage";

export function useCreatePost() {
    const router = useRouter();
    const { handleSubmit, formState: { errors }, register, reset } = useForm<CreatePostInput>({ resolver: zodResolver(createPostSchema) });
    const [createPost, { isLoading }] = useCreatePostMutation()
    const [serverError, setServerError] = useState<string | null>(null);
    const onSubmit = async (data: CreatePostInput) => {
        setServerError(null);
        try {
            const formData = new FormData();
            formData.append("text", data.text.trim());
            const title = data.title?.trim();
            if (title) formData.append("title", title);
            const file = data.image?.[0];
            if (file) formData.append("image", file);
            await createPost(formData).unwrap()
            reset()
            router.push("/");
        }
        catch (e: unknown) {
            setServerError(getServerMessage(e, "Creating post failed. Please try again."));
        }
    };
    return {
        submit: handleSubmit(onSubmit),
        errors, register, serverError, isLoading
    }
}
