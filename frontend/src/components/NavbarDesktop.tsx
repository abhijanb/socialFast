import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";

type NavbarDesktopProps = {
    pathname: string;
};

export function NavbarDesktop({ pathname }: NavbarDesktopProps) {
    return (
        <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                            isActive
                                ? "bg-accent-50 text-accent-700 dark:bg-accent-900/20 dark:text-accent-400"
                                : "text-text-secondary hover:bg-surface-sunken hover:text-text-primary"
                        }`}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
