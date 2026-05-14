import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import type { AvatarColor } from '@/lib/types';

type Props = {
  name: string;
  destination?: string;
  note?: string;
  initials: string;
  color: AvatarColor | string;
  isMe?: boolean;
};

export function PersonRow({ name, destination, note, initials, color, isMe }: Props) {
  const detail = [destination ? `→ ${destination}` : null, note ? note : null]
    .filter(Boolean)
    .join(' · ');

  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-sm border-[1.5px] px-3 py-2',
        isMe ? 'border-primary bg-primary-soft' : 'border-line bg-card'
      )}
    >
      <Avatar initials={initials} color={color} size={32} />
      <div className="flex-1">
        <div className="text-sm font-bold leading-none">
          {name}
          {isMe && <span className="ml-1 text-[10px] font-semibold text-primary">(tu)</span>}
        </div>
        {detail && (
          <div className="mt-1 text-[11px] font-medium text-ink-soft">{detail}</div>
        )}
      </div>
    </div>
  );
}
