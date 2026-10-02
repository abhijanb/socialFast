import Link from "next/link";
import { Plus } from "lucide-react";
import { ProfileAvatar } from "@/features/profile/ProfileAvatar";

type NavbarActionsProps = {
    username?: string;
    avatar?: string | null;
    isLoggingOut: boolean;
    onLogout: () => void;
};

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
                className="hidden items-center gap-1.5 rounded-lg bg-accent-600 px-3 py-1.5 text-sm font-medium text-white shadow-soft transition-all duration-200 hover:bg-accent-700 hover:shadow-lift md:inline-flex"
            >
                <Plus className="size-3.5" />
                New post
            </Link>

            {username ? (
                <Link
                    href="/profile"
                    aria-label={username}
                    className="rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-accent-200"
                >
                    <ProfileAvatar username={username} src={avatar} size="sm" />
                </Link>
            ) : null}

            <button
                type="button"
                onClick={onLogout}
                disabled={isLoggingOut}
                className="hidden rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary disabled:opacity-50 md:inline-flex"
            >
                Log out
            </button>
        </div>
    );
}
