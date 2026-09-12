import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function initialsOf(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const CHAT_OPENS_OFFSET_MS = 3 * 60 * 60 * 1000;

export function slotStartDate(date: string, startTime: string): Date {
  return new Date(`${date}T${startTime}:00`);
}

export function chatOpensAt(date: string, startTime: string): Date {
  return new Date(slotStartDate(date, startTime).getTime() - CHAT_OPENS_OFFSET_MS);
}

export function isChatOpen(date: string, startTime: string, now: Date = new Date()): boolean {
  return now.getTime() >= chatOpensAt(date, startTime).getTime();
}

export type Countdown = { hours: number; minutes: number; seconds: number; done: boolean };

export function computeCountdown(target: Date, now: Date = new Date()): Countdown {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, done: true };
  const totalSec = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSec / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    done: false,
  };
}

export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function todayIso(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
}

export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

/** "venerdì 12 settembre", with the year appended when it isn't the current one. */
export function formatDateIT(date: string, today: string = todayIso()): string {
  const d = new Date(`${date}T00:00:00`);
  const sameYear = date.slice(0, 4) === today.slice(0, 4);
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

export type SlotStatus = 'done' | 'future' | 'chatready' | 'countdown' | 'waiting';

const COUNTDOWN_WINDOW_MS = 6 * 60 * 60 * 1000;

export function getSlotStatus(
  date: string,
  startTime: string,
  durationMinutes: number,
  now: Date = new Date()
): SlotStatus {
  const today = todayIso(now);
  if (date < today) return 'done';
  if (date > today) return 'future';

  const start = slotStartDate(date, startTime);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  const opens = chatOpensAt(date, startTime);
  const nowMs = now.getTime();

  if (nowMs >= end.getTime()) return 'done';
  if (nowMs >= opens.getTime()) return 'chatready';
  if (opens.getTime() - nowMs < COUNTDOWN_WINDOW_MS) return 'countdown';
  return 'waiting';
}
