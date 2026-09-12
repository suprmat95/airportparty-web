'use client';

import { notFound } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, Lock, Plane, Send } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { AvatarStack } from '@/components/ui/AvatarStack';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ChatBubble } from '@/components/ui/ChatBubble';
import { Tag } from '@/components/ui/Tag';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/lib/useAuth';
import { fetchAirport } from '@/lib/api/airports';
import { fetchSlot } from '@/lib/api/slots';
import { fetchMessages, sendMessage } from '@/lib/api/messages';
import type { MessageWithProfile, SlotWithParticipants } from '@/lib/api/types';
import type { Airport } from '@/lib/types';
import { chatOpensAt, cn, formatTime, initialsOf, isChatOpen } from '@/lib/utils';
import { matchKind, sortByAffinity } from '@/lib/affinity';
import { MatchBadge } from '@/components/ui/MatchBadge';
import Link from 'next/link';

export default function ChatPage({ params }: { params: { slotId: string } }) {
  const { user } = useAuth();

  const [slot, setSlot] = useState<SlotWithParticipants | null>(null);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [messages, setMessages] = useState<MessageWithProfile[]>([]);

  const mobileScrollerRef = useRef<HTMLDivElement>(null);
  const desktopScrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchSlot(params.slotId)
      .then(async (s) => {
        if (cancelled) return;
        if (!s) {
          setMissing(true);
          return;
        }
        setSlot(s);
        const a = await fetchAirport(s.airportCode);
        if (!cancelled) setAirport(a);
        if (isChatOpen(s.date, s.startTime)) {
          const msgs = await fetchMessages(s.id);
          if (!cancelled) setMessages(msgs);
        }
      })
      .catch((e) => {
        console.error('chat fetch', e);
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slotId]);

  useEffect(() => {
    if (mobileScrollerRef.current) {
      mobileScrollerRef.current.scrollTop = mobileScrollerRef.current.scrollHeight;
    }
    if (desktopScrollerRef.current) {
      desktopScrollerRef.current.scrollTop = desktopScrollerRef.current.scrollHeight;
    }
  }, [messages.length]);

  const open = useMemo(
    () => (slot ? isChatOpen(slot.date, slot.startTime) : false),
    [slot]
  );

  const participants = slot?.participants ?? [];
  const me = user ? participants.find((p) => p.userId === user.id) ?? null : null;
  const joined = me !== null;
  const avatars = participants.slice(0, 4).map((p) => ({
    initials: initialsOf(p.profile.name),
    color: p.profile.avatarColor,
  }));

  async function send(text: string) {
    if (!slot) return;
    const { error } = await sendMessage(slot.id, text);
    if (error) {
      alert(`Errore: ${error}`);
      return;
    }
    const refreshed = await fetchMessages(slot.id);
    setMessages(refreshed);
  }

  if (missing) notFound();
  if (loading || !slot) {
    return (
      <>
        <MobileShell>
          <NavBar back="/airport" />
          <div className="flex flex-1 items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </MobileShell>
        <DesktopShell activeNav="my-slots">
          <div className="flex h-[60vh] items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </DesktopShell>
      </>
    );
  }

  if (!open) {
    const opensAt = chatOpensAt(slot.date, slot.startTime);
    const lockedBody = (
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded bg-card-alt">
          <Lock className="h-6 w-6 text-ink-muted" strokeWidth={2} />
        </div>
        <h2 className="mb-1 text-[20px] font-semibold tracking-tight text-ink">
          La chat è ancora chiusa
        </h2>
        <p className="max-w-[280px] text-[13px] font-medium text-ink-soft">
          Si apre {opensAt.toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit' })}, 3 ore prima del meetup.
        </p>
        <Link href={`/slot/${slot.id}`} className={buttonClass('secondary', 'md', false, 'mt-5')}>
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
          Torna allo slot
        </Link>
      </div>
    );

    return (
      <>
        <MobileShell>
          <NavBar back={`/slot/${slot.id}`} />
          {lockedBody}
        </MobileShell>
        <DesktopShell activeNav="my-slots">
          <div className="flex h-[70vh] items-center justify-center">{lockedBody}</div>
        </DesktopShell>
      </>
    );
  }

  const canSend = joined;

  return (
    <>
      <MobileShell className="pb-0">
        <NavBar
          back={`/slot/${slot.id}`}
          right={airport && <Tag variant="filled">{airport.code}</Tag>}
        />

        <Card className="mb-3 flex items-center justify-between p-3">
          <div>
            <div className="font-mono text-[18px] font-bold leading-none text-ink">
              {slot.startTime}
            </div>
            <div className="mt-1 text-[11px] font-medium text-ink-soft">
              {slot.meetingPoint}
            </div>
          </div>
          <AvatarStack items={avatars} size={26} />
        </Card>

        <div className="mb-3 rounded-sm border border-primary/30 bg-primary-soft px-3 py-2 text-[12px] font-semibold text-primary-dark">
          Chat aperta. Meetup alle {slot.startTime} al {slot.meetingPoint}.
        </div>

        <div ref={mobileScrollerRef} className="flex-1 space-y-3 overflow-y-auto pb-2">
          {messages.map((m) => (
            <ChatBubble
              key={m.id}
              from={m.profile.name}
              initials={initialsOf(m.profile.name)}
              color={m.profile.avatarColor}
              text={m.text}
              time={formatTime(m.createdAt)}
              isMe={user ? m.userId === user.id : false}
            />
          ))}
        </div>

        <ChatInputBar
          onSend={send}
          disabled={!canSend}
          placeholder={canSend ? 'Scrivi un messaggio…' : 'Partecipa allo slot per scrivere'}
          variant="mobile"
        />
      </MobileShell>

      <DesktopShell activeNav="my-slots" container={false}>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-[260px] flex-shrink-0 overflow-y-auto border-r border-line bg-card">
            <div className="border-b border-line p-5">
              <div className="font-mono text-[28px] font-bold leading-none tracking-tight text-ink">
                {slot.startTime}
              </div>
              <div className="mt-2 text-[13px] font-semibold text-ink-soft">
                {airport?.city ?? slot.airportCode} · {airport?.code}
              </div>
              <div className="mt-1 text-[12px] font-medium text-ink-muted">
                {slot.meetingPoint}
              </div>
            </div>
            <div className="p-5">
              <div className="label-cap mb-3">Partecipanti · {participants.length}</div>
              <ul className="space-y-2">
                {sortByAffinity(participants, me).map((p) => (
                  <li key={p.id} className="flex items-center gap-2.5">
                    <Avatar
                      initials={initialsOf(p.profile.name)}
                      color={p.profile.avatarColor}
                      size={28}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[13px] font-semibold text-ink">
                        <span className="truncate">{p.profile.name}</span>
                        {me && p.userId === me.userId && (
                          <span className="text-[10px] font-semibold text-primary">(tu)</span>
                        )}
                        <MatchBadge kind={matchKind(me, p)} />
                      </div>
                      {p.destination && (
                        <div className="flex items-center gap-1 truncate text-[11px] font-medium text-ink-soft">
                          <Plane className="h-3 w-3" strokeWidth={2} />
                          {p.destination}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="flex flex-1 flex-col overflow-hidden">
            <div className="border-b border-primary/20 bg-primary-soft px-6 py-3 text-[13px] font-semibold text-primary-dark">
              Chat aperta. Meetup alle {slot.startTime} al {slot.meetingPoint}.
            </div>

            <div
              ref={desktopScrollerRef}
              className="flex-1 space-y-3 overflow-y-auto px-6 py-5"
            >
              {messages.map((m) => (
                <ChatBubble
                  key={m.id}
                  from={m.profile.name}
                  initials={initialsOf(m.profile.name)}
                  color={m.profile.avatarColor}
                  text={m.text}
                  time={formatTime(m.createdAt)}
                  isMe={user ? m.userId === user.id : false}
                />
              ))}
            </div>

            <ChatInputBar
              onSend={send}
              disabled={!canSend}
              placeholder={canSend ? 'Scrivi un messaggio…' : 'Partecipa allo slot per scrivere'}
              variant="desktop"
            />
          </section>
        </div>
      </DesktopShell>
    </>
  );
}

function ChatInputBar({
  onSend,
  disabled,
  placeholder,
  variant,
}: {
  onSend: (text: string) => void | Promise<void>;
  disabled?: boolean;
  placeholder: string;
  variant: 'mobile' | 'desktop';
}) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || disabled || sending) return;
    setSending(true);
    try {
      await onSend(value);
      setText('');
    } finally {
      setSending(false);
    }
  }

  if (variant === 'mobile') {
    return (
      <form
        onSubmit={submit}
        className="sticky bottom-0 -mx-5 mt-3 border-t border-line bg-bg/95 px-5 py-3 backdrop-blur"
      >
        <div className="flex items-center gap-2 rounded border border-line bg-card px-3.5 py-2 transition focus-within:border-primary">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || sending}
            className="flex-1 bg-transparent text-[14px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || sending || !text.trim()}
            aria-label="Invia"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white transition active:scale-95 disabled:opacity-40"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={submit} className="border-t border-line bg-card px-6 py-4">
      <div className="flex items-center gap-2 rounded border border-line bg-bg px-3.5 py-2 transition focus-within:border-primary">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || sending}
          className="flex-1 bg-transparent text-[14px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || sending || !text.trim()}
          aria-label="Invia"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white transition active:scale-95 disabled:opacity-40'
          )}
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
