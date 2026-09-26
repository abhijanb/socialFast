import { useForm } from "react-hook-form";
import { postSchema, postType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePostMutation } from "./api";
import { useState } from "react";
import { getServerMessage } from "@/core/getServerMessage";

export function useCreatePost() {
    const { handleSubmit, formState: { errors }, register, reset } = useForm<postType>({ resolver: zodResolver(postSchema) });
    const [createPost, { isLoading }] = useCreatePostMutation()
    const [serverError, setServerError] = useState<string | null>(null);
    const onSubmit = async (data: postType) => {
        setServerError(null);
        try {
            const formData = new FormData();
            formData.append("text", data.text);
            if (data.title) formData.append("title", data.title);
            const file = data.image?.[0];
            if (file) formData.append("image", file);
            await createPost(formData).unwrap()
            reset()
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
