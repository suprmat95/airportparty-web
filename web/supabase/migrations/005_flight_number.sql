-- 004: optional flight number on slot participants.
-- Lets people find who is on the same flight, not just the same hour.
-- Run in Supabase Dashboard → SQL Editor.

ALTER TABLE public.slot_participants
  ADD COLUMN IF NOT EXISTS flight_number TEXT;

COMMENT ON COLUMN public.slot_participants.flight_number IS
  'Normalized (uppercase, no spaces) IATA flight number, e.g. FR1234. Optional.';
