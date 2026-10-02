"use client";

import Link from "next/link";
import { useRegister } from "@/features/auth/register/useRegister";
import { Logo } from "@/components/Logo";

const Page = () => {
    const { submit, errors, register, isLoading } = useRegister();
    return (
        <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 py-10">
            <div className="w-full max-w-sm animate-scale-in">
                <div className="mb-8 flex flex-col items-center">
                    <Logo />
                    <h1 className="mt-6 font-display text-3xl font-normal italic text-text-primary">
                        Join socialFast
                    </h1>
                    <p className="mt-2 text-sm text-text-secondary">
                        Create your account to get started
                    </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-soft">
                    <form onSubmit={submit} className="flex flex-col gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="text-sm font-medium text-text-primary">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                autoComplete="username"
                                placeholder="Choose a username"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                                {...register("username")}
                            />
                            {errors.username && <p className="text-sm text-red-600">{errors.username.message}</p>}
                        </div>

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
                                autoComplete="new-password"
                                placeholder="Create a password"
                                className="w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-all duration-200 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
                                {...register("password")}
                            />
                            {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="avatar" className="text-sm font-medium text-text-primary">
                                Avatar <span className="text-text-tertiary">(optional)</span>
                            </label>
                            <input
                                id="avatar"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="w-full text-sm text-text-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-surface-sunken file:px-3 file:py-2 file:text-sm file:font-medium file:text-text-primary hover:file:bg-border"
                                {...register("avatar")}
                            />
                            {errors.avatar && <p className="text-sm text-red-600">{errors.avatar.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-2 w-full rounded-lg bg-accent-600 py-2.5 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-700 hover:shadow-lift disabled:opacity-50"
                        >
                            {isLoading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="font-medium text-accent-600 hover:text-accent-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Page
