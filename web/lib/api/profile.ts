import { createClient } from '@/lib/supabase/client';
import type { ProfileStats } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function fetchProfileStats(userId: string): Promise<ProfileStats> {
  const supabase = createClient();

  // Slot count + distinct airports + slot IDs to compute encounters
  const { data: myJoins, error } = await supabase
    .from('slot_participants')
    .select('slot_id, slots(airport_code)')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);

  const slots = (myJoins ?? []).length;
  const airports = new Set<string>();
  for (const row of (myJoins ?? []) as any[]) {
    const slotRow = Array.isArray(row.slots) ? row.slots[0] : row.slots;
    if (slotRow?.airport_code) airports.add(slotRow.airport_code);
  }

  let encounters = 0;
  const slotIds = (myJoins ?? []).map((j: any) => j.slot_id);
  if (slotIds.length > 0) {
    const { count } = await supabase
      .from('slot_participants')
      .select('*', { count: 'exact', head: true })
      .in('slot_id', slotIds);
    encounters = Math.max(0, (count ?? 0) - slots);
  }

  return { slots, encounters, airports: airports.size };
}
