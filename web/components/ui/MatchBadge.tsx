import type { MatchKind } from '@/lib/affinity';

type Props = { kind: MatchKind };

/** "Stesso volo" / "Stessa destinazione" pill next to a participant's name. */
export function MatchBadge({ kind }: Props) {
  if (!kind) return null;
  const isFlight = kind === 'flight';
  return (
    <span
      className={
        'inline-flex items-center rounded-pill border px-1.5 py-px text-[10px] font-semibold leading-tight ' +
        (isFlight
          ? 'border-success/30 bg-success/10 text-success'
          : 'border-primary/30 bg-primary-soft text-primary-dark')
      }
    >
      {isFlight ? 'Stesso volo' : 'Stessa destinazione'}
    </span>
  );
}
