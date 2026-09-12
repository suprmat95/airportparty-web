import { Plane, Ticket } from 'lucide-react';
import { Avatar } from './Avatar';
import { MatchBadge } from './MatchBadge';
import { cn } from '@/lib/utils';
import type { AvatarColor } from '@/lib/types';
import type { MatchKind } from '@/lib/affinity';

type Props = {
  name: string;
  destination?: string;
  flightNumber?: string;
  note?: string;
  initials: string;
  color: AvatarColor | string;
  isMe?: boolean;
  /** Affinity with the viewer: same flight, same destination, or none. */
  match?: MatchKind;
};

export function PersonRow({
  name,
  destination,
  flightNumber,
  note,
  initials,
  color,
  isMe,
  match = null,
}: Props) {
  const hasDetail = destination || flightNumber || note;
  const matchesMe = match !== null;
  return (
    <div
      className={cn(
        'flex items-center gap-2.5 rounded-sm border px-3 py-2',
        isMe ? 'border-primary bg-primary-soft' : 'border-line bg-card'
      )}
    >
      <Avatar initials={initials} color={color} size={32} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5 text-sm font-semibold leading-none">
          <span>{name}</span>
          {isMe && <span className="text-[10px] font-semibold text-primary">(tu)</span>}
          <MatchBadge kind={match} />
        </div>
        {hasDetail && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-ink-soft">
            {destination && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-mono',
                  (matchesMe || isMe) && 'text-primary-dark'
                )}
              >
                <Plane className="h-3 w-3" strokeWidth={2} />
                {destination}
              </span>
            )}
            {flightNumber && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 font-mono',
                  match === 'flight' && 'text-success'
                )}
              >
                <Ticket className="h-3 w-3" strokeWidth={2} />
                {flightNumber}
              </span>
            )}
            {(destination || flightNumber) && note && <span aria-hidden>·</span>}
            {note && <span>{note}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
