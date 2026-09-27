"use client";

import { useAuthGuard } from "@/features/auth/useAuthGuard";
import { Navbar } from "@/components/Navbar";


export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuthGuard();

    if (isLoading || !user) {
        return null;
    }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}