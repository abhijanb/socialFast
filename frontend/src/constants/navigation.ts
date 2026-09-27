export type NavLink = {
    href: string;
    label: string;
};

export const NAV_LINKS: NavLink[] = [
    { href: "/", label: "Feed" },
    { href: "/post/create", label: "Create" },
    { href: "/profile", label: "Profile" },
];
