"use client";
import { getImageUrl } from "@/core/getImageUrl";
import { ProfileAvatar } from "./ProfileAvatar";
import { useGetProfileQuery } from "./api";
import { ProfileSkeleton } from "@/components/Skeleton";

export function ProfileView() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  if (isLoading) {
    return <ProfileSkeleton />;
  }
  if (error) {
    return <div className="py-16 text-center text-sm text-red-600">Error loading profile.</div>;
  }
  if (profile) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center bg-surface px-4 py-16 animate-fade-in">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 opacity-20 blur-sm" />
          <ProfileAvatar
            username={profile.username}
            src={profile.avatar ? getImageUrl(profile.avatar) : null}
            size="xl"
            className="relative ring-4 ring-surface-raised"
          />
        </div>
        <h1 className="mt-6 font-display text-3xl font-normal italic text-text-primary">
          {profile.username}
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Member of socialFast
        </p>
      </div>
    );
  }
}
