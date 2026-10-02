export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl border border-border bg-surface-raised p-6 shadow-soft">
      <div className="space-y-3">
        <div className="h-4 w-1/3 rounded-full bg-surface-sunken" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-surface-sunken" />
          <div className="h-3 w-5/6 rounded-full bg-surface-sunken" />
          <div className="h-3 w-2/3 rounded-full bg-surface-sunken" />
        </div>
      </div>
      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="size-5 rounded-full bg-surface-sunken" />
          <div className="h-3 w-8 rounded-full bg-surface-sunken" />
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-4">
      <div className="size-24 animate-pulse rounded-full bg-surface-sunken" />
      <div className="h-5 w-32 animate-pulse rounded-full bg-surface-sunken" />
      <div className="h-3 w-48 animate-pulse rounded-full bg-surface-sunken" />
    </div>
  );
}
