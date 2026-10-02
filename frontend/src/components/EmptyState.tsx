import { PenLine } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-50 to-accent-100 text-accent-600 dark:from-accent-900/20 dark:to-accent-800/20 dark:text-accent-400">
        {icon ?? <PenLine className="size-8" />}
      </div>
      <h3 className="mt-5 font-display text-xl font-normal italic text-text-primary">{title}</h3>
      {description && (
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">{description}</p>
      )}
    </div>
  );
}
