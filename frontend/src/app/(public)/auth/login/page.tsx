"use client";

import { baseApi } from "@/app/baseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form"
import z from "zod";

const loginSchema = z.object({
    password: z.string().min(8),
    email: z.email()
})
type loginType = z.infer<typeof loginSchema>

// api
const loginApi = baseApi.injectEndpoints({
    endpoints(build) {
        return {
            login: build.mutation<any, loginType>({
                query: (body: loginType) => ({
                    url: "/auth/login", body: body, method: "POST"
                })
            })
        }
    },
})
const { useLoginMutation } = loginApi

const Page = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<loginType>({ resolver: zodResolver(loginSchema) });
    const [loginUser] = useLoginMutation()
    const onSubmit = async (body: loginType) => {
        // TODO: wire to POST /auth/login
        try {
            await loginUser(body).unwrap()
        }
        catch (e) {
            console.log(e)
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>

                <label htmlFor="email">Email</label>
                <input id="email" type="email" autoComplete="email" {...register("email")} />
                {errors.email && <p>{errors.email.message}</p>}

                <label htmlFor="password">Password</label>
                <input id="password" type="password" autoComplete="new-password" {...register("password")} />
                {errors.password && <p>{errors.password.message}</p>}

                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default Page