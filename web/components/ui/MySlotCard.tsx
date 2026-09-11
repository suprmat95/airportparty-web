'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Plane } from 'lucide-react';
import { Tag } from './Tag';
import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { chatOpensAt, cn, computeCountdown, formatDateIT, pad2, type SlotStatus } from '@/lib/utils';
import type { Slot } from '@/lib/types';

type Props = {
  slot: Slot;
  airportCity: string;
  status: SlotStatus;
  avatars: AvatarStackItem[];
  participantsCount: number;
  destination?: string;
  href: string;
  showDate?: boolean;
};

const STATUS_LABEL: Record<SlotStatus, string> = {
  countdown: 'Chat tra poco',
  chatready: 'Chat aperta',
  waiting: 'In attesa',
  future: 'Programmato',
  done: 'Completato',
};

const STATUS_CLASSES: Record<SlotStatus, string> = {
  countdown: 'bg-warning-soft text-warning',
  chatready: 'bg-primary-soft text-primary-dark',
  waiting: 'bg-card-alt text-ink-soft',
  future: 'bg-card-alt text-ink-soft',
  done: 'bg-bg text-ink-muted',
};

export function MySlotCard({
  slot,
  airportCity,
  status,
  avatars,
  participantsCount,
  destination,
  href,
  showDate = false,
}: Props) {
  const isCountdown = status === 'countdown';
  const isDone = status === 'done';

  return (
    <Link
      href={href}
      className={cn(
        'block rounded border bg-card p-4 transition',
        isCountdown ? 'border-warning' : 'border-line hover:border-ink-muted',
        isDone && 'opacity-70'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-[22px] font-bold leading-none text-ink">
            {slot.startTime}
          </span>
          <Tag variant="filled">{slot.airportCode}</Tag>
        </div>

        {destination && (
          <span className="inline-flex items-center gap-1 font-mono text-[12px] font-semibold text-ink-soft">
            <Plane className="h-3 w-3" strokeWidth={2} />
            {destination}
          </span>
        )}
      </div>

      <div className="mt-1.5 text-[12px] font-semibold text-ink-soft">
        {slot.meetingPoint} · {airportCity}
        {showDate && <span className="ml-1.5 text-ink-muted">· {formatDateIT(slot.date)}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AvatarStack items={avatars} size={24} />
          <span className="text-[11px] font-semibold text-ink-soft">
            {participantsCount} {participantsCount === 1 ? 'persona' : 'persone'}
          </span>
        </div>

        <StatusBadge status={status} slot={slot} />
      </div>

      {isCountdown && (
        <div className="mt-3 flex items-center gap-1 border-t border-line pt-3 text-[12px] font-semibold text-warning">
          Vedi dettagli
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </div>
      )}
    </Link>
  );
}

function StatusBadge({ status, slot }: { status: SlotStatus; slot: Slot }) {
  if (status === 'countdown') {
    return <CountdownBadge slot={slot} />;
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 text-[11px] font-semibold',
        STATUS_CLASSES[status]
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function CountdownBadge({ slot }: { slot: Slot }) {
  const target = chatOpensAt(slot.date, slot.startTime);
  const [tick, setTick] = useState(() => computeCountdown(target));

  useEffect(() => {
    const id = setInterval(() => setTick(computeCountdown(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (tick.done) {
    return (
      <span className="inline-flex items-center rounded-pill bg-primary-soft px-3 py-1 text-[11px] font-semibold text-primary-dark">
        {STATUS_LABEL.chatready}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-warning-soft px-3 py-1 text-[11px] font-semibold text-warning">
      <Clock className="h-3 w-3" strokeWidth={2.5} />
      <span className="font-mono">
        {pad2(tick.hours)}:{pad2(tick.minutes)}:{pad2(tick.seconds)}
      </span>
    </span>
  );
}
