"use client";

import { useAuthGuard } from "@/features/auth/useAuthGuard";


export default function Layout({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuthGuard();

    if (isLoading || !user) {
        return null;
    }

  return (
    <div className="flex min-h-screen flex-col">
      parent
      <main className="flex-1">{children}</main>
    </div>
  );
}