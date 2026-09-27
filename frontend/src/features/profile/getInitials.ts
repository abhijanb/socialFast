/**
 * getInitials — derives avatar fallback initials from a username.
 *
 * "First Last" -> "FL", single names/emails -> first 2 chars uppercased,
 * blank -> "?". Used by `ProfileAvatar` when no avatar image is available.
 */
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
