import { useForm } from "react-hook-form";
import { registerSchema, registerType } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "./api";
import { useState } from "react";
import { getServerMessage } from "@/core/getServerMessage";

export function useRegister() {
    const { handleSubmit, formState: { errors }, register } = useForm<registerType>({ resolver: zodResolver(registerSchema) });
    const [registerUser, { isLoading }] = useRegisterMutation()
    const [serverError, setServerError] = useState<string | null>(null);
    const onSubmit = async (body: registerType) => {
        setServerError(null);
        try {
            await registerUser(body).unwrap()
        }
        catch (e: unknown) {
            setServerError(getServerMessage(e, "Registration failed. Please try again."));
        }
    };
    return {
        submit: handleSubmit(onSubmit),
        errors, register, serverError, isLoading
    }
}
