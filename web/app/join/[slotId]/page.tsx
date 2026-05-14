'use client';

import { notFound, useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { DesktopShell } from '@/components/layout/DesktopShell';
import { BackLink } from '@/components/layout/BackLink';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Tag } from '@/components/ui/Tag';
import { useAuth } from '@/lib/useAuth';
import { fetchAirport } from '@/lib/api/airports';
import { fetchSlot, findExistingSlot, findOrCreateSlot } from '@/lib/api/slots';
import { joinSlot } from '@/lib/api/participants';
import {
  buildVirtualSlot,
  isVirtualSlotId,
  parseVirtualSlotId,
} from '@/lib/api/virtual';
import type { SlotWithParticipants } from '@/lib/api/types';
import type { Airport } from '@/lib/types';
import { initialsOf, formatDateIT } from '@/lib/utils';

export default function JoinSlotPage({ params }: { params: { slotId: string } }) {
  const router = useRouter();
  const { user, signUp } = useAuth();

  const [slot, setSlot] = useState<SlotWithParticipants | null>(null);
  const [airport, setAirport] = useState<Airport | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [destination, setDestination] = useState('');
  const [note, setNote] = useState('');
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function load() {
      if (isVirtualSlotId(params.slotId)) {
        const parsed = parseVirtualSlotId(params.slotId);
        if (!parsed) {
          if (!cancelled) setMissing(true);
          return;
        }
        const real = await findExistingSlot(
          parsed.airportCode,
          parsed.date,
          parsed.startTime
        );
        if (cancelled) return;
        const s = real ?? buildVirtualSlot(parsed.airportCode, parsed.date, parsed.startTime);
        setSlot(s);
        const a = await fetchAirport(s.airportCode);
        if (!cancelled) setAirport(a);
        return;
      }

      const s = await fetchSlot(params.slotId);
      if (cancelled) return;
      if (!s) {
        setMissing(true);
        return;
      }
      setSlot(s);
      const a = await fetchAirport(s.airportCode);
      if (!cancelled) setAirport(a);
    }

    load()
      .catch((e) => {
        console.error('join fetch', e);
        if (!cancelled) setMissing(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.slotId]);

  const isGuest = !user;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!slot) return;

    if (isGuest) {
      if (!name.trim() || !email.trim() || password.length < 6) {
        setError('Compila nome, email e una password di almeno 6 caratteri.');
        return;
      }
      if (!accept) {
        setError('Accetta i termini per continuare.');
        return;
      }
    }

    if (!destination.trim()) {
      setError('Indica la tua destinazione.');
      return;
    }

    setSubmitting(true);

    if (isGuest) {
      const { error: signUpError } = await signUp(name.trim(), email.trim(), password);
      if (signUpError) {
        setSubmitting(false);
        setError(signUpError);
        return;
      }
      // Wait a beat for the session to propagate so joinSlot sees the user.
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    // If the slot is virtual, materialize it in DB first.
    let realSlotId = slot.id;
    if (isVirtualSlotId(slot.id)) {
      const { id, error: createError } = await findOrCreateSlot(
        slot.airportCode,
        slot.date,
        slot.startTime,
        slot.durationMinutes
      );
      if (createError || !id) {
        setSubmitting(false);
        setError(createError ?? 'Impossibile creare lo slot.');
        return;
      }
      realSlotId = id;
    }

    const { error: joinError } = await joinSlot(
      realSlotId,
      destination.trim().toUpperCase(),
      note.trim()
    );

    setSubmitting(false);

    if (joinError) {
      setError(joinError);
      return;
    }

    router.push(`/slot/${realSlotId}`);
    router.refresh();
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
        <DesktopShell activeNav="airports">
          <div className="flex h-[60vh] items-center justify-center text-[13px] font-medium text-ink-soft">
            Caricamento…
          </div>
        </DesktopShell>
      </>
    );
  }

  const accountFields = (
    <>
      <InputField
        label="nome"
        icon={<User className="h-5 w-5" strokeWidth={2} />}
        placeholder="Come ti chiami?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        label="email"
        icon={<Mail className="h-5 w-5" strokeWidth={2} />}
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="password"
        icon={<Lock className="h-5 w-5" strokeWidth={2} />}
        type="password"
        placeholder="min. 6 caratteri"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </>
  );

  const loggedAccount = user && (
    <div className="flex items-center gap-3 rounded-[20px] border-[1.5px] border-line bg-card-alt p-3 shadow">
      <Avatar
        initials={initialsOf(user.name)}
        color={user.avatarColor}
        size={40}
      />
      <div className="flex-1">
        <div className="text-[14px] font-bold text-ink">{user.name}</div>
        <div className="text-[11px] font-medium text-ink-soft">{user.email}</div>
      </div>
      <span className="text-[11px] font-semibold text-primary">loggato</span>
    </div>
  );

  const slotFields = (
    <>
      <InputField
        label="destinazione"
        icon="✈"
        placeholder="es. BCN"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <InputField
        label="nota (opzionale)"
        icon="✦"
        placeholder="es. caffè pre-volo?"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </>
  );

  const termsCheckbox = isGuest && (
    <label className="mb-5 mt-2 flex items-start gap-2.5 text-[12px] font-medium text-ink-soft">
      <input
        type="checkbox"
        checked={accept}
        onChange={(e) => setAccept(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-primary"
      />
      <span>
        Accetto i termini e la privacy. Riceverò solo notifiche relative agli slot a cui partecipo.
      </span>
    </label>
  );

  const errorBox = error && (
    <div className="mb-3 rounded-sm border-[1.5px] border-error/30 bg-error/10 px-3 py-2 text-[12px] font-semibold text-error">
      {error}
    </div>
  );

  const submitButton = (
    <Button type="submit" variant="primary" fullWidth disabled={submitting}>
      {submitting
        ? 'attendere…'
        : isGuest
          ? 'Crea account e join ✈'
          : 'join · entra nel gruppo ✈'}
    </Button>
  );

  return (
    <>
      <MobileShell>
        <NavBar back={`/airport/${slot.airportCode.toLowerCase()}/${slot.id}`} />

        <h1 className="mb-1 text-[26px] font-extrabold leading-[1.1] tracking-tighter text-ink">
          {isGuest ? (
            <>entra nel gruppo <span className="text-primary">delle {slot.startTime}</span></>
          ) : (
            <>quasi fatto!</>
          )}
        </h1>
        <p className="mb-5 text-[13px] font-medium text-ink-soft">
          {airport?.city ?? slot.airportCode} · {formatDateIT(slot.date)} · ore{' '}
          <span className="font-mono font-bold text-ink">{slot.startTime}</span>
        </p>

        <form onSubmit={onSubmit}>
          {isGuest ? (
            <>
              <div className="label-cap mb-2 ml-1">crea il tuo account</div>
              {accountFields}
            </>
          ) : (
            <div className="mb-5">{loggedAccount}</div>
          )}

          <div className="label-cap mb-2 ml-1 mt-5">le tue info per lo slot</div>
          {slotFields}

          {!isGuest && <div className="mb-2" />}
          {termsCheckbox}
          {errorBox}

          {submitButton}
        </form>
      </MobileShell>

      <DesktopShell activeNav="airports">
        <div className={isGuest ? 'mx-auto max-w-[780px]' : 'mx-auto max-w-[580px]'}>
          <BackLink
            href={`/airport/${slot.airportCode.toLowerCase()}/${slot.id}`}
            label="Torna allo slot"
            className="mb-5"
          />

          <div className="mb-6 flex items-center justify-between rounded-[20px] border border-line bg-card p-5 shadow">
            <div>
              <div className="label-cap">{formatDateIT(slot.date)}</div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-mono text-[28px] font-bold leading-none text-ink">
                  {slot.startTime}
                </span>
                <span className="text-[14px] font-semibold text-ink-soft">
                  {airport?.city ?? slot.airportCode} · {slot.meetingPoint}
                </span>
              </div>
            </div>
            {airport && <Tag variant="filled">{airport.code}</Tag>}
          </div>

          <h1 className="mb-5 text-[32px] font-extrabold leading-[1.1] tracking-tighter text-ink">
            {isGuest ? (
              <>entra nel gruppo <span className="text-primary">delle {slot.startTime}</span></>
            ) : (
              <>quasi fatto!</>
            )}
          </h1>

          <form onSubmit={onSubmit}>
            {isGuest ? (
              <div className="flex gap-7">
                <section className="flex-1">
                  <div className="label-cap mb-2">crea il tuo account</div>
                  {accountFields}
                </section>

                <div className="w-px self-stretch bg-line" aria-hidden />

                <section className="flex-1">
                  <div className="label-cap mb-2">le tue info per lo slot</div>
                  {slotFields}
                  {termsCheckbox}
                  {errorBox}
                  {submitButton}
                </section>
              </div>
            ) : (
              <div>
                <div className="mb-5">{loggedAccount}</div>
                <div className="label-cap mb-2">le tue info per lo slot</div>
                {slotFields}
                <div className="mb-2" />
                {errorBox}
                {submitButton}
              </div>
            )}
          </form>
        </div>
      </DesktopShell>
    </>
  );
}
