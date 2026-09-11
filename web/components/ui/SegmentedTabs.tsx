'use client';

import { cn } from '@/lib/utils';

export type SegmentedTabItem<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

type Props<T extends string> = {
  items: SegmentedTabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  fullWidth?: boolean;
  className?: string;
};

export function SegmentedTabs<T extends string>({
  items,
  active,
  onChange,
  fullWidth = true,
  className,
}: Props<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        'rounded bg-card-alt p-1',
        fullWidth ? 'flex w-full' : 'inline-flex',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.id)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-[13px] font-semibold transition',
              fullWidth && 'flex-1',
              isActive
                ? 'border border-line bg-card text-ink'
                : 'border border-transparent text-ink-soft hover:text-ink'
            )}
          >
            <span>{item.label}</span>
            {typeof item.count === 'number' && (
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.5 font-mono text-[10px]',
                  isActive ? 'bg-primary-soft text-primary-dark' : 'bg-bg text-ink-muted'
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
