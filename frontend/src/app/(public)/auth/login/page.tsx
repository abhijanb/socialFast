"use client";

import { useLogin } from "@/features/auth/login/useLogin";


const Page = () => {
    const { submit, errors, register, serverError, isLoading } = useLogin();
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-neutral-50 px-4">
            <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold">Login</h1>
                {serverError && <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{serverError}</p>}
                <form onSubmit={submit} className="mt-4 flex flex-col gap-3">

                    <label htmlFor="email" className="text-sm font-medium text-neutral-700">Email</label>
                    <input id="email" type="email" autoComplete="email" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900" {...register("email")} />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}

                    <label htmlFor="password" className="text-sm font-medium text-neutral-700">Password</label>
                    <input id="password" type="password" autoComplete="current-password" className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-neutral-900" {...register("password")} />
                    {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}

                    <button type="submit" disabled={isLoading} className="mt-2 rounded-md bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50">login</button>
                </form>
            </div>
        </div>
    )
}

export default Page
