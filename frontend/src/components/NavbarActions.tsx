import Link from "next/link";
import { ProfileAvatar } from "@/features/profile/ProfileAvatar";

type NavbarActionsProps = {
    username?: string;
    avatar?: string | null;
    isLoggingOut: boolean;
    onLogout: () => void;
};

/**
 * NavbarActions — right-side actions of the authenticated Navbar.
 *
 * Renders "+ New post" link, profile avatar link, and desktop "Log out"
 * button. Used inside `Navbar` header row; hidden on mobile except avatar
 * (mobile links live in `NavbarMobile`).
 */
export function NavbarActions({
    username,
    avatar,
    isLoggingOut,
    onLogout,
}: NavbarActionsProps) {
    return (
        <div className="flex items-center gap-2">
            <Link
                href="/post/create"
                className="hidden rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-700 md:inline-flex"
            >
                + New post
            </Link>

            {username ? (
                <Link href="/profile" aria-label={username}>
                    <ProfileAvatar username={username} src={avatar} size="sm" />
                </Link>
            ) : null}

            <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 md:inline-flex"
            >
                Log out
            </button>
        </div>
    );
}
