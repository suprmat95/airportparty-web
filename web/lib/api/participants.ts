import { createClient } from '@/lib/supabase/client';
import { normalizeSlot } from './normalize';
import type { MyJoinedSlot } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function joinSlot(
  slotId: string,
  destination: string,
  note: string
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) return { error: 'Devi essere loggato per fare join.' };
  const { error } = await supabase.from('slot_participants').insert({
    slot_id: slotId,
    user_id: userResult.user.id,
    destination,
    note,
  });
  return { error: error?.message ?? null };
}

export async function leaveSlot(slotId: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) return { error: 'Non sei loggato.' };
  const { error } = await supabase
    .from('slot_participants')
    .delete()
    .eq('slot_id', slotId)
    .eq('user_id', userResult.user.id);
  return { error: error?.message ?? null };
}

export async function isUserInSlot(slotId: string): Promise<boolean> {
  const supabase = createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) return false;
  const { data, error } = await supabase
    .from('slot_participants')
    .select('id')
    .eq('slot_id', slotId)
    .eq('user_id', userResult.user.id)
    .maybeSingle();
  if (error) return false;
  return !!data;
}

export async function fetchMyJoinedSlots(): Promise<MyJoinedSlot[]> {
  const supabase = createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) return [];

  const { data: joins, error } = await supabase
    .from('slot_participants')
    .select(
      `id, destination, note, joined_at,
       slots(
         id, airport_code, date, start_time, duration_minutes, meeting_point, meeting_note,
         airports(code, city, name)
       )`
    )
    .eq('user_id', userResult.user.id)
    .order('joined_at', { ascending: false });
  if (error) throw new Error(error.message);
  if (!joins || joins.length === 0) return [];

  // Count participants per slot in one query
  const slotIds = joins
    .map((j: any) => j.slots?.id)
    .filter((id: string | undefined): id is string => !!id);
  const { data: counts } = await supabase
    .from('slot_participants')
    .select('slot_id')
    .in('slot_id', slotIds);
  const countMap = new Map<string, number>();
  for (const c of (counts ?? []) as any[]) {
    countMap.set(c.slot_id, (countMap.get(c.slot_id) ?? 0) + 1);
  }

  return (joins as any[])
    .filter((j) => j.slots)
    .map((j) => {
      const slotRow = Array.isArray(j.slots) ? j.slots[0] : j.slots;
      const airportRow = slotRow.airports
        ? Array.isArray(slotRow.airports)
          ? slotRow.airports[0]
          : slotRow.airports
        : null;
      const slot = normalizeSlot(slotRow);
      return {
        ...slot,
        destination: j.destination ?? '',
        note: j.note ?? '',
        airportCity: airportRow?.city ?? slot.airportCode,
        airportName: airportRow?.name ?? '',
        participantsCount: countMap.get(slot.id) ?? 0,
      };
    });
}
