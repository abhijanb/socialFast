import { useForm } from "react-hook-form";
import { registerSchema, registerType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "./api";
import { useState } from "react";

function getServerMessage(e: any): string {
    const d = e?.data?.detail;
    if (typeof d === "string") return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join(", ");
    if (typeof e?.error === "string") return e.error;
    return "Registration failed. Please try again.";
}

export function useRegister() {
    const { handleSubmit, formState: { errors }, register } = useForm<registerType>({ resolver: zodResolver(registerSchema) });
    const [registerUser, { isLoading }] = useRegisterMutation()
    const [serverError, setServerError] = useState<string | null>(null);
    const onSubmit = async (body: registerType) => {
        setServerError(null);
        try {
            await registerUser(body).unwrap()
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
