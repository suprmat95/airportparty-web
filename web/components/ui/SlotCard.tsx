import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { Button } from './Button';
import { Card } from './Card';
import { DestinationChips } from './DestinationChips';
import type { DestinationGroup } from '@/lib/affinity';

type Props = {
  time: string;
  going: number;
  avatars: AvatarStackItem[];
  /** Where the people in this slot are flying to, most common first. */
  destinations?: DestinationGroup[];
  highlight?: boolean;
  joined?: boolean;
  onJoin?: () => void;
};

export function peopleLabel(going: number): string {
  if (going === 0) return 'Nessuno, per ora';
  return `${going} ${going === 1 ? 'persona' : 'persone'}`;
}

export function SlotCard({ time, going, avatars, destinations = [], highlight, joined, onJoin }: Props) {
  return (
    <Card highlight={highlight} className="flex items-center justify-between gap-3 p-3.5">
      <div className="min-w-0">
        <div className="font-mono text-lg font-bold leading-none text-ink">{time}</div>
        <div className="mt-1.5 flex items-center gap-2">
          {going > 0 && <AvatarStack items={avatars} size={22} />}
          <span className="text-xs font-medium text-ink-soft">{peopleLabel(going)}</span>
        </div>
        {destinations.length > 0 && (
          <div className="mt-1.5">
            <DestinationChips groups={destinations} max={3} />
          </div>
        )}
      </div>
      <Button variant={highlight || joined ? 'primary' : 'secondary'} size="sm" onClick={onJoin}>
        {joined ? 'Iscritto' : 'Partecipa'}
      </Button>
    </Card>
  );
}
