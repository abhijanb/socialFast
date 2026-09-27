"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NavbarActions } from "./NavbarActions";
import { NavbarDesktop } from "./NavbarDesktop";
import { NavbarMobile } from "./NavbarMobile";
import { selectAuthUser } from "@/features/auth/slice";
import { useLogout } from "@/features/auth/logout/useLogout";
import { useAppSelector } from "@/core/store";

export function Navbar() {
    const pathname = usePathname();
    const user = useAppSelector(selectAuthUser);
    const { logout, isLoading: isLoggingOut } = useLogout();
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur">
            <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4">
                <Link href="/" className="text-base font-semibold tracking-tight text-neutral-900">
                    socialFast
                </Link>

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
                        className="rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm text-neutral-700 md:hidden"
                    >
                        ☰
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
