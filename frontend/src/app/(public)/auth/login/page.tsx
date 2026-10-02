"use client";

import Link from "next/link";
import { useLogin } from "@/features/auth/login/useLogin";
import { Logo } from "@/components/Logo";

const Page = () => {
    const { submit, errors, register, isLoading } = useLogin();
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4">
            <div className="w-full max-w-sm animate-scale-in">
                <div className="mb-8 flex flex-col items-center">
                    <Logo />
                    <h1 className="mt-6 font-display text-3xl font-normal italic text-text-primary">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        Sign in to your account
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-soft">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium text-text-primary">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium text-text-primary">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-700 hover:shadow-lift disabled:opacity-50"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="font-medium text-accent-600 hover:text-accent-700">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Page
