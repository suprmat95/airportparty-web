import { pad2 } from '@/lib/utils';
import type { SlotWithParticipants, TimelineSlot } from './types';

// Virtual slot ID format: v-{AIRPORT}-{YYYYMMDD}-{HHMM}
const VIRTUAL_RE = /^v-([A-Z]{3})-(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/;

export function isVirtualSlotId(id: string): boolean {
  return VIRTUAL_RE.test(id);
}

export function buildVirtualSlotId(
  airportCode: string,
  date: string,
  startTime: string
): string {
  return `v-${airportCode.toUpperCase()}-${date.replace(/-/g, '')}-${startTime.replace(':', '')}`;
}

export function parseVirtualSlotId(
  id: string
): { airportCode: string; date: string; startTime: string } | null {
  const m = id.match(VIRTUAL_RE);
  if (!m) return null;
  return {
    airportCode: m[1],
    date: `${m[2]}-${m[3]}-${m[4]}`,
    startTime: `${m[5]}:${m[6]}`,
  };
}

const DEFAULT_MEETING_POINT = 'Bar Terminal 1';
const DEFAULT_MEETING_NOTE = 'vicino gate B · landside';

export function buildVirtualSlot(
  airportCode: string,
  date: string,
  startTime: string,
  durationMinutes = 60
): TimelineSlot {
  return {
    id: buildVirtualSlotId(airportCode, date, startTime),
    airportCode,
    date,
    startTime,
    durationMinutes,
    meetingPoint: DEFAULT_MEETING_POINT,
    meetingNote: DEFAULT_MEETING_NOTE,
    participants: [],
    isVirtual: true,
  };
}

export function generateVirtualSlots(
  airportCode: string,
  date: string,
  fromHour = 6,
  toHour = 22,
  durationMinutes = 60
): TimelineSlot[] {
  const out: TimelineSlot[] = [];
  for (let h = fromHour; h <= toHour; h++) {
    const startTime = `${pad2(h)}:00`;
    out.push(buildVirtualSlot(airportCode, date, startTime, durationMinutes));
  }
  return out;
}

/**
 * Merge a list of virtual slots with the real slots that already exist in DB
 * for the same (airport, date). Real slots win — they replace the virtual at
 * the same start_time. Real slots whose time doesn't match any virtual (e.g.
 * non-hourly leftovers) are appended so they aren't lost.
 */
export function mergeSlots(
  virtuals: TimelineSlot[],
  reals: SlotWithParticipants[]
): TimelineSlot[] {
  const realByTime = new Map<string, SlotWithParticipants>();
  for (const r of reals) realByTime.set(r.startTime, r);

  const used = new Set<string>();
  const merged: TimelineSlot[] = virtuals.map((v) => {
    const real = realByTime.get(v.startTime);
    if (real) {
      used.add(real.startTime);
      return { ...real, isVirtual: false };
    }
    return v;
  });

  // Append any real slots that don't match the virtual grid
  for (const r of reals) {
    if (!used.has(r.startTime)) {
      merged.push({ ...r, isVirtual: false });
    }
  }

  merged.sort((a, b) => a.startTime.localeCompare(b.startTime));
  return merged;
}
