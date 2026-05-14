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

export function SlotRow({ time, going, avatars, highlight, joined, onJoin }: Props) {
  return (
    <div
      className={cn(
        'flex w-full items-center gap-5 rounded-[20px] border-[1.5px] px-5 py-4 shadow transition hover:shadow-lg',
        highlight ? 'border-primary bg-primary-soft' : 'border-line bg-card'
      )}
    >
      <div className="min-w-[80px] font-mono text-[24px] font-bold leading-none text-ink">
        {time}
      </div>

      <div className="h-10 w-px bg-line" aria-hidden />

      <div className="flex flex-1 items-center gap-3">
        <AvatarStack items={avatars} size={28} />
        <span className="text-[13px] font-semibold text-ink-soft">
          {going} {going === 1 ? 'persona' : 'persone'}
        </span>
      </div>

      <Button
        variant={highlight || joined ? 'primary' : 'secondary'}
        size="sm"
        onClick={onJoin}
      >
        {joined ? '✓ joined' : 'join'}
      </Button>
    </div>
  );
}
