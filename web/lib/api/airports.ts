import { createClient } from '@/lib/supabase/client';
import type { Airport } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

let cache: Airport[] | null = null;
let inflight: Promise<Airport[]> | null = null;

async function load(): Promise<Airport[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('airports')
    .select('code, name, city, country')
    .order('city');
  if (error) throw new Error(error.message);
  const list = (data ?? []).map((a: any) => ({
    code: a.code,
    name: a.name,
    city: a.city,
    country: a.country ?? 'IT',
  }));
  cache = list;
  return list;
}

export async function fetchAirports(): Promise<Airport[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = load().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

export async function fetchAirport(code: string): Promise<Airport | null> {
  const all = await fetchAirports();
  const upper = code.toUpperCase();
  return all.find((a) => a.code === upper) ?? null;
}
