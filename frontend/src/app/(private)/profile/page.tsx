import type { Metadata } from "next";
import { ProfileView } from "@/features/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  description: "View your profile",
};

export default function ProfilePage() {
  return <ProfileView />;
}
