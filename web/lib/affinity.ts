/**
 * "Chi va dove vai tu": pure helpers to group slot participants by
 * destination and flight, and to rank them by affinity with the viewer.
 * No I/O, no React — safe to use from any page or component.
 */

type Traveler = {
  userId: string;
  destination: string;
  flightNumber: string;
};

export type DestinationGroup = { code: string; count: number };

export type MatchKind = 'flight' | 'destination' | null;

/** Uppercase, strip spaces and dashes: "fr 1234" → "FR1234". */
export function normalizeFlightNumber(raw: string): string {
  return raw.replace(/[\s-]+/g, '').toUpperCase();
}

/**
 * Destinations present in a slot, most common first, ties by code.
 * Participants without a destination are ignored.
 */
export function groupDestinations(participants: Traveler[]): DestinationGroup[] {
  const counts = new Map<string, number>();
  for (const p of participants) {
    const code = p.destination.trim().toUpperCase();
    if (!code) continue;
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
}

/**
 * How closely `other` matches `me`: same flight beats same destination.
 * Returns null when there is no viewer, when comparing someone to themselves,
 * or when nothing matches.
 */
export function matchKind(me: Traveler | null | undefined, other: Traveler): MatchKind {
  if (!me || me.userId === other.userId) return null;
  if (me.flightNumber && me.flightNumber === other.flightNumber) return 'flight';
  const a = me.destination.trim().toUpperCase();
  const b = other.destination.trim().toUpperCase();
  if (a && a === b) return 'destination';
  return null;
}

const MATCH_RANK: Record<Exclude<MatchKind, null>, number> = { flight: 0, destination: 1 };

/**
 * Stable sort: the viewer first, then same flight, then same destination,
 * then everyone else in their original order.
 */
export function sortByAffinity<T extends Traveler>(participants: T[], me: Traveler | null | undefined): T[] {
  const rank = (p: T): number => {
    if (me && p.userId === me.userId) return -1;
    const kind = matchKind(me, p);
    return kind ? MATCH_RANK[kind] : 2;
  };
  return participants
    .map((p, i) => ({ p, i, r: rank(p) }))
    .sort((a, b) => a.r - b.r || a.i - b.i)
    .map((x) => x.p);
}

/** Label for the slot header: "2 per BCN" or "" when the viewer has no match. */
export function sameDestinationLabel(participants: Traveler[], me: Traveler | null | undefined): string {
  if (!me) return '';
  const code = me.destination.trim().toUpperCase();
  if (!code) return '';
  const n = participants.filter((p) => p.userId !== me.userId && p.destination.trim().toUpperCase() === code).length;
  return n > 0 ? `${n} per ${code}` : '';
}
