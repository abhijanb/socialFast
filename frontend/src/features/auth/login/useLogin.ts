import { useForm } from "react-hook-form";
import { loginSchema, loginType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "./api";
import { useState } from "react";
import { getServerMessage } from "@/core/getServerMessage";

export function useLogin() {
    const { handleSubmit, formState: { errors }, register } = useForm<loginType>({ resolver: zodResolver(loginSchema) });
    const [loginUser, { isLoading }] = useLoginMutation()
    const [serverError, setServerError] = useState<string | null>(null);
    const onSubmit = async (body: loginType) => {
        setServerError(null);
        try {
           const response = await loginUser(body).unwrap()
           console.log(response)
        }
        catch (e: unknown) {
            setServerError(getServerMessage(e, "Login failed. Please try again."));
        }
    };
    return {
        submit: handleSubmit(onSubmit),
        errors, register, serverError, isLoading
    }
}
