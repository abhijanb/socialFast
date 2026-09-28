"use client";
import { getImageUrl } from "@/core/getImageUrl";
import { ProfileAvatar } from "./ProfileAvatar";
import { useGetProfileQuery } from "./api";

export function ProfileView() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error loading profile.</div>;
  }
  if (profile) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center bg-neutral-50 px-4 py-10">
        <ProfileAvatar
          username={profile.username}
          src={profile.avatar ? getImageUrl(profile.avatar) : null}
          size="xl"
        />
        <h1 className="mt-4 text-2xl font-semibold">{profile.username}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          This is the profile page content.
        </p>
      </div>
    );
  }
}
