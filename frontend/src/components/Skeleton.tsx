export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-surface-raised p-4 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-surface-sunken" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 rounded-full bg-surface-sunken" />
          <div className="h-2.5 w-16 rounded-full bg-surface-sunken" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-3/4 rounded-full bg-surface-sunken" />
        <div className="h-3 w-1/2 rounded-full bg-surface-sunken" />
      </div>
      <div className="mt-4 aspect-[4/5] rounded-xl bg-surface-sunken" />
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
