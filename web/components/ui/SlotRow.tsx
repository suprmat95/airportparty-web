import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { Button } from './Button';
import { Card } from './Card';
import { peopleLabel } from './SlotCard';
import { DestinationChips } from './DestinationChips';
import { cn } from '@/lib/utils';
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

export function SlotRow({ time, going, avatars, destinations = [], highlight, joined, onJoin }: Props) {
  return (
    <Card
      highlight={highlight}
      className={cn('flex w-full items-center gap-5 px-5 py-4 transition', !highlight && 'hover:border-ink-muted')}
    >
      <div className="min-w-[80px] font-mono text-[24px] font-bold leading-none text-ink">
        {time}
      </div>

      <div className="h-10 w-px bg-line" aria-hidden />

      <div className="flex flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-3">
          {going > 0 && <AvatarStack items={avatars} size={28} />}
          <span className="text-[13px] font-medium text-ink-soft">{peopleLabel(going)}</span>
        </div>
        {destinations.length > 0 && <DestinationChips groups={destinations} />}
      </div>

      <Button
        variant={highlight || joined ? 'primary' : 'secondary'}
        size="sm"
        onClick={onJoin}
      >
        {joined ? 'Iscritto' : 'Partecipa'}
      </Button>
    </Card>
  );
}
