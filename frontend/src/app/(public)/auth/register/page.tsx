"use client";

import { baseApi } from "@/app/baseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import z from "zod";

const registerSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
    email: z.email()
})
type registerType = z.infer<typeof registerSchema>

// api
const registerApi = baseApi.injectEndpoints({
    endpoints(build) {
        return {
            register: build.mutation<any, registerType>({
                query: (body: registerType) => ({
                    url: "/auth/register", body: body, method: "POST"
                })
            })
        }
    },
})
const { useRegisterMutation } = registerApi

const Page = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<registerType>({ resolver: zodResolver(registerSchema) });
    const [registerUser] = useRegisterMutation()
    const onSubmit = async (body: registerType) => {
        // TODO: wire to POST /auth/register
        try {
            await registerUser(body).unwrap()
        }
        catch (e) {
            console.log(e)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" autoComplete="username" {...register("username")} />
                {errors.username && <p>{errors.username.message}</p>}

                <label htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}

                <label htmlFor="password">Password</label>
                <input id="password" type="password" autoComplete="new-password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}

                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Page