import { Plane } from 'lucide-react';
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
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-sm border px-3 py-2',
        isMe ? 'border-primary bg-primary-soft' : 'border-line bg-card'
      )}
    >
      <Avatar initials={initials} color={color} size={32} />
      <div className="flex-1">
        <div className="text-sm font-semibold leading-none">
          {name}
          {isMe && <span className="ml-1 text-[10px] font-semibold text-primary">(tu)</span>}
        </div>
        {(destination || note) && (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
            {destination && (
              <span className="inline-flex items-center gap-1 font-mono">
                <Plane className="h-3 w-3" strokeWidth={2} />
                {destination}
              </span>
            )}
            {destination && note && <span aria-hidden>·</span>}
            {note && <span>{note}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
