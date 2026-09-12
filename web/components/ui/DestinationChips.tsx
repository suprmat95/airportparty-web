import type { DestinationGroup } from '@/lib/affinity';

type Props = {
  groups: DestinationGroup[];
  /** How many chips to show before collapsing the rest into "+N". */
  max?: number;
};

/** Compact "BCN ×2 · LIS · DXB" row shown under a slot's people count. */
export function DestinationChips({ groups, max = 4 }: Props) {
  if (groups.length === 0) return null;
  const shown = groups.slice(0, max);
  const rest = groups.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((g) => (
        <span
          key={g.code}
          className="inline-flex items-center gap-1 rounded-sm border border-line bg-card-alt px-2 py-0.5 font-mono text-[11px] font-semibold text-ink-soft"
        >
          {g.code}
          {g.count > 1 && <span className="font-medium text-ink-muted">×{g.count}</span>}
        </span>
      ))}
      {rest > 0 && (
        <span className="text-[11px] font-medium text-ink-muted">+{rest}</span>
      )}
    </div>
  );
}
