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
        <div className="border-t border-neutral-200 bg-white px-4 py-2 md:hidden">
            <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onClose}
                        className={
                            pathname === link.href
                                ? "rounded-md bg-neutral-100 px-3 py-2 text-sm font-medium text-neutral-900"
                                : "rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                        }
                    >
                        {link.label}
                    </Link>
                ))}
                <hr className="my-2 border-neutral-200" />
                <Link
                    href="/post/create"
                    onClick={onClose}
                    className="rounded-md bg-neutral-900 px-3 py-2 text-center text-sm font-medium text-white"
                >
                    + New post
                </Link>
                <button
                    type="button"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                    className="rounded-md px-3 py-2 text-left text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
