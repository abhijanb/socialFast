import Link from "next/link";
import { NAV_LINKS } from "@/constants/navigation";

type NavbarDesktopProps = {
    pathname: string;
};

export function NavbarDesktop({ pathname }: NavbarDesktopProps) {
    return (
        <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={
                        pathname === link.href
                            ? "rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white"
                            : "rounded-md px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    }
                >
                    {link.label}
                </Link>
            ))}
        </div>
    );
}
