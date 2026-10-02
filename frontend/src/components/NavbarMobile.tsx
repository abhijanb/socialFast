import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";

type NavbarMobileProps = {
    open: boolean;
    pathname: string;
    isLoggingOut: boolean;
    onClose: () => void;
    onLogout: () => void;
};

export function NavbarMobile({
    open,
    pathname,
    isLoggingOut,
    onClose,
    onLogout,
}: NavbarMobileProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="border-t border-border bg-surface-raised px-4 py-3 md:hidden animate-slide-up">
            <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={onClose}
                            className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                                isActive
                                    ? "bg-accent-50 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400"
                                    : "text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
                <div className="my-2 border-t border-border" />
                <Link
                    href="/post/create"
                    onClick={onClose}
                    className="rounded-lg bg-accent-600 px-3 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-accent-700"
                >
                    + New post
                </Link>
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary disabled:opacity-50"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
