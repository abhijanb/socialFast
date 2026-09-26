import { useForm } from "react-hook-form";
import { loginSchema, loginType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "./api";
import { useState } from "react";

function getServerMessage(e: any): string {
    const d = e?.data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join(", ");
    if (typeof e?.error === "string") return e.error;
    return "Login failed. Please try again.";
}

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
        catch (e: any) {
            setServerError(getServerMessage(e));
        }
    };
    return {
        submit: handleSubmit(onSubmit),
        errors, register, serverError, isLoading
    }
}
