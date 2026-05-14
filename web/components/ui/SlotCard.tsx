import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { Button } from './Button';
import { cn } from '@/lib/utils';

type Props = {
  time: string;
  going: number;
  avatars: AvatarStackItem[];
  highlight?: boolean;
  joined?: boolean;
  onJoin?: () => void;
};

export function SlotCard({ time, going, avatars, highlight, joined, onJoin }: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-[20px] border-[1.5px] p-3.5 shadow',
        highlight ? 'border-primary bg-primary-soft' : 'border-line bg-card'
      )}
    >
      <div>
        <div className="font-mono text-lg font-bold leading-none text-ink">{time}</div>
        <div className="mt-1.5 flex items-center gap-2">
          <AvatarStack items={avatars} size={22} />
          <span className="text-xs font-semibold text-ink-soft">
            {going} {going === 1 ? 'persona' : 'persone'}
          </span>
        </div>
      </div>
      <Button variant={highlight || joined ? 'primary' : 'secondary'} size="sm" onClick={onJoin}>
        {joined ? '✓ joined' : 'join'}
      </Button>
    </div>
  );
}
