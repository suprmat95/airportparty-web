import { createClient } from '@/lib/supabase/client';
import { normalizeParticipant, normalizeSlot } from './normalize';
import type { SlotWithParticipants } from './types';

const SLOT_SELECT = `
  id, airport_code, date, start_time, duration_minutes, meeting_point, meeting_note,
  slot_participants(
    id, user_id, destination, note, joined_at,
    profiles(id, name, email, avatar_color)
  )
`;

/* eslint-disable @typescript-eslint/no-explicit-any */

function mapSlotRow(row: any): SlotWithParticipants {
  const slot = normalizeSlot(row);
  const participants = ((row.slot_participants ?? []) as any[]).map((p) =>
    normalizeParticipant(p, row.id)
  );
  return { ...slot, participants };
}

export async function fetchSlotsForAirport(
  airportCode: string,
  date: string
): Promise<SlotWithParticipants[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('slots')
    .select(SLOT_SELECT)
    .eq('airport_code', airportCode.toUpperCase())
    .eq('date', date)
    .order('start_time');
  if (error) throw new Error(error.message);
  return (data ?? []).map(mapSlotRow);
}

export async function fetchSlot(slotId: string): Promise<SlotWithParticipants | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('slots')
    .select(SLOT_SELECT)
    .eq('id', slotId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSlotRow(data) : null;
}

/**
 * Find a real slot by its (airport, date, startTime) identity. Returns null
 * if no DB row exists for that slot yet.
 */
export async function findExistingSlot(
  airportCode: string,
  date: string,
  startTime: string
): Promise<SlotWithParticipants | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('slots')
    .select(SLOT_SELECT)
    .eq('airport_code', airportCode.toUpperCase())
    .eq('date', date)
    .eq('start_time', startTime)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapSlotRow(data) : null;
}

/**
 * Find a slot by (airport, date, startTime) or create it if missing.
 * Returns the slot id. Used at join time when the user clicks a virtual slot.
 */
export async function findOrCreateSlot(
  airportCode: string,
  date: string,
  startTime: string,
  durationMinutes = 60,
  meetingPoint = 'Bar Terminal 1',
  meetingNote = 'vicino gate B · landside'
): Promise<{ id: string | null; error: string | null }> {
  const supabase = createClient();
  const code = airportCode.toUpperCase();

  // Try select first to avoid a useless INSERT round trip when the slot exists.
  const existing = await supabase
    .from('slots')
    .select('id')
    .eq('airport_code', code)
    .eq('date', date)
    .eq('start_time', startTime)
    .maybeSingle();
  if (existing.data?.id) return { id: existing.data.id, error: null };
  if (existing.error && existing.error.code !== 'PGRST116') {
    return { id: null, error: existing.error.message };
  }

  // Insert; rely on UNIQUE(airport_code, date, start_time) to handle races.
  const insert = await supabase
    .from('slots')
    .insert({
      airport_code: code,
      date,
      start_time: startTime,
      duration_minutes: durationMinutes,
      meeting_point: meetingPoint,
      meeting_note: meetingNote,
    })
    .select('id')
    .single();

  if (insert.error) {
    // Race: another client just created it — pick it up.
    const refetch = await supabase
      .from('slots')
      .select('id')
      .eq('airport_code', code)
      .eq('date', date)
      .eq('start_time', startTime)
      .maybeSingle();
    if (refetch.data?.id) return { id: refetch.data.id, error: null };
    return { id: null, error: insert.error.message };
  }

  return { id: insert.data.id, error: null };
}
