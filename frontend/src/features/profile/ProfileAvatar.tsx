import Image from "next/image";
import { getInitials } from "./getInitials";

type ProfileAvatarSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

type ProfileAvatarProps = {
  username: string;
  src?: string | null;
  alt?: string;
  size?: ProfileAvatarSize;
  className?: string;
};

export function ProfileAvatar({
  username,
  src,
  alt,
  size = "md",
  className = "",
}: ProfileAvatarProps) {
  const classes = `relative shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`.trim();

  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? username}
        aria-label={username}
        fill
        unoptimized
        sizes="96px"
        className={`${classes} object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={username}
      className={`${classes} flex items-center justify-center bg-gradient-to-br from-accent-100 to-accent-200 font-semibold text-accent-700 dark:from-accent-800 dark:to-accent-900 dark:text-accent-300`}
    >
      {getInitials(username)}
    </div>
  );
}
