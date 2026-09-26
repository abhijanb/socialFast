import type { Metadata } from "next";
import { ProfileAvatar } from "./_components/ProfileAvatar";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your profile",
};

// TODO: replace with GET /auth/me once the current-user endpoint exists.
// Backend User has no avatar column yet, so `src` is undefined and initials show.
const PLACEHOLDER_USER = {
  username: "Jane Doe",
  avatarUrl: undefined as string | undefined,
};

export default function ProfilePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center bg-neutral-50 px-4 py-10">
      <ProfileAvatar
        username={PLACEHOLDER_USER.username}
        src={PLACEHOLDER_USER.avatarUrl}
        size="xl"
      />
      <h1 className="mt-4 text-2xl font-semibold">{PLACEHOLDER_USER.username}</h1>
      <p className="mt-1 text-sm text-neutral-500">
        This is the profile page content.
      </p>
    </div>
  );
}
