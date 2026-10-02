"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavbarActions } from "./NavbarActions";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { Logo } from "./Logo";
import { selectAuthUser } from "@/features/auth/slice";
import { useLogout } from "@/features/auth/logout/useLogout";
import { useAppSelector } from "@/core/store";

export function Navbar() {
    const pathname = usePathname();
    const user = useAppSelector(selectAuthUser);
    const { logout, isLoading: isLoggingOut } = useLogout();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-surface-raised/80 backdrop-blur-md">
            <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
                <Logo />

                <NavbarDesktop pathname={pathname} />

                <div className="flex items-center gap-2">
                    <NavbarActions
                        username={user?.username}
                        avatar={user?.avatar}
                        isLoggingOut={isLoggingOut}
                        onLogout={logout}
                    />
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        className="rounded-lg border border-border p-2 text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary md:hidden"
                    >
                        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {open ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </nav>

            <NavbarMobile
                open={open}
                pathname={pathname}
                isLoggingOut={isLoggingOut}
                onClose={() => setOpen(false)}
                onLogout={logout}
            />
        </header>
    );
}
