import { addDays } from './utils';

/**
 * How far ahead a departure day can be chosen, counted in days from today.
 * Single source of truth for the booking horizon: the home picker, the
 * airport-page selector and the `?date=` validation all read this constant.
 */
export const BOOKING_HORIZON_DAYS = 2 * 365;

export const DAY_SHORT = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
/** Weekday initials in Monday-first order, as shown on the calendar header. */
export const WEEKDAY_HEADER = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
export const MONTH_FULL_IT = [
  'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
  'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre',
];
export const MONTH_SHORT_IT = [
  'gen', 'feb', 'mar', 'apr', 'mag', 'giu',
  'lug', 'ago', 'set', 'ott', 'nov', 'dic',
];

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** True for a well-formed `YYYY-MM-DD` that names a real calendar day. */
export function isIsoDate(value: string): boolean {
  const m = value.match(ISO_DATE_RE);
  if (!m) return false;
  const [, y, mo, d] = m.map(Number);
  if (mo < 1 || mo > 12 || d < 1) return false;
  return d <= daysInMonth(y, mo - 1);
}

/** Last selectable day (inclusive) for a given "today". */
export function maxBookingDate(today: string): string {
  return addDays(today, BOOKING_HORIZON_DAYS);
}

/**
 * Clamp a candidate day into the bookable window [today, today + horizon].
 * Returns true when the day is selectable as-is.
 */
export function isBookableDate(iso: string, today: string): boolean {
  return isIsoDate(iso) && iso >= today && iso <= maxBookingDate(today);
}

/**
 * Resolve the `?date=` search param into a day the page can show.
 * Missing, malformed, past or beyond-horizon values fall back to today so a
 * stale or hand-edited link never errors.
 */
export function parseDateParam(raw: string | null | undefined, today: string): string {
  if (!raw) return today;
  return isBookableDate(raw, today) ? raw : today;
}

/** Path to an airport's timeline with the chosen day in the URL. */
export function airportDateHref(code: string, date: string): string {
  return `/airport/${code.toLowerCase()}?date=${date}`;
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

export function toIso(year: number, monthIndex: number, day: number): string {
  const mm = String(monthIndex + 1).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

export function splitIso(iso: string): { year: number; monthIndex: number; day: number } {
  const [y, m, d] = iso.split('-').map(Number);
  return { year: y, monthIndex: m - 1, day: d };
}

/** Local-time Date for an ISO day; avoids the UTC shift of `new Date('YYYY-MM-DD')`. */
export function localDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/**
 * Cells of a Monday-first month grid: `null` for leading/trailing padding,
 * an ISO day otherwise. Always a multiple of 7 cells.
 */
export function monthGrid(year: number, monthIndex: number): (string | null)[] {
  const firstWeekday = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay(); // 0 = Sunday
  const leading = (firstWeekday + 6) % 7; // Monday-first offset
  const total = daysInMonth(year, monthIndex);
  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let d = 1; d <= total; d++) cells.push(toIso(year, monthIndex, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export function monthTitle(year: number, monthIndex: number): string {
  return `${MONTH_FULL_IT[monthIndex]} ${year}`;
}

/** "oggi" / "domani" for the two nearest days, otherwise null. */
export function dayChipLabel(iso: string, today: string): string | null {
  if (iso === today) return 'oggi';
  if (iso === addDays(today, 1)) return 'domani';
  return null;
}

/** Short label for buttons: "oggi", "domani", "ven 14 nov", "ven 14 nov 2027". */
export function ctaLabel(iso: string, today: string): string {
  const chip = dayChipLabel(iso, today);
  if (chip) return chip;
  const d = localDate(iso);
  const base = `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_SHORT_IT[d.getMonth()]}`;
  return sameYear(iso, today) ? base : `${base} ${d.getFullYear()}`;
}

/** Hero phrasing: "oggi", "domani", "il 14 novembre", "il 14 novembre 2027". */
export function heroDateLabel(iso: string, today: string): string {
  const chip = dayChipLabel(iso, today);
  if (chip) return chip;
  const d = localDate(iso);
  const base = `il ${d.getDate()} ${MONTH_FULL_IT[d.getMonth()]}`;
  return sameYear(iso, today) ? base : `${base} ${d.getFullYear()}`;
}

/** Long label for fields: "Oggi, venerdì 12 settembre" / "Sabato 14 novembre 2027". */
export function fieldDateLabel(iso: string, today: string): string {
  const d = localDate(iso);
  const long = d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    ...(sameYear(iso, today) ? {} : { year: 'numeric' as const }),
  });
  const chip = dayChipLabel(iso, today);
  const text = chip ? `${chip}, ${long}` : long;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function sameYear(a: string, b: string): boolean {
  return a.slice(0, 4) === b.slice(0, 4);
}
