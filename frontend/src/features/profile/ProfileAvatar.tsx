import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProfileAvatarSize = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<ProfileAvatarSize, string> = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-lg",
  xl: "size-24 text-2xl",
};

export function getInitials(username: string): string {
  const name = username.trim();
  if (!name) return "?";
  // Handle "First Last" -> "FL", "single" -> first 2 chars, "email@..." -> first 2 chars.
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

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
  className,
}: ProfileAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)} aria-label={username}>
      <AvatarImage src={src ?? undefined} alt={alt ?? username} />
      <AvatarFallback>{getInitials(username)}</AvatarFallback>
    </Avatar>
  );
}
