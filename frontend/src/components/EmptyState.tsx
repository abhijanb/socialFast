import { Camera } from "lucide-react";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
};

export function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-accent-50 text-accent-600 dark:bg-accent-900/20 dark:text-accent-400">
        {icon ?? <Camera className="size-7" />}
      </div>
      <h3 className="mt-4 text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-text-secondary">{description}</p>
      )}
    </div>
  );
}
