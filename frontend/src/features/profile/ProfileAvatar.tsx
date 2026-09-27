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
  const classes = `shrink-0 overflow-hidden rounded-full ${sizeClasses[size]} ${className}`.trim();

  if (src) {
    return (
      // Backend serves small dynamic avatar uploads; next/image remote
      // optimization adds config/cost with no LCP benefit here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? username}
        aria-label={username}
        className={`${classes} object-cover`}
      />
    );
  }

  return (
    <div
      aria-label={username}
      className={`${classes} flex items-center justify-center bg-neutral-200 font-medium text-neutral-700`}
    >
      {getInitials(username)}
    </div>
  );
}
