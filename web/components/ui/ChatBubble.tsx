import { Avatar } from './Avatar';
import { cn } from '@/lib/utils';
import type { AvatarColor } from '@/lib/types';

type Props = {
  from: string;
  initials: string;
  color: AvatarColor | string;
  text: string;
  time: string;
  isMe?: boolean;
};

export function ChatBubble({ from, initials, color, text, time, isMe }: Props) {
  return (
    <div
      className={cn(
        'flex items-end gap-1.5',
        isMe ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar initials={initials} color={color} size={24} />
      <div className="max-w-[72%] lg:max-w-[55%]">
        {!isMe && (
          <div className="mb-0.5 ml-2.5 text-[10px] font-semibold text-ink-muted">{from}</div>
        )}
        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-[13px] font-medium leading-snug',
            isMe ? 'bg-primary text-white' : 'border-[1.5px] border-line bg-card text-ink'
          )}
        >
          {text}
        </div>
        <div
          className={cn(
            'mt-0.5 font-mono text-[9px] text-ink-muted',
            isMe ? 'mr-2.5 text-right' : 'ml-2.5 text-left'
          )}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
