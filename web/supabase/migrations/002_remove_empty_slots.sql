-- ============================================================================
-- Migration: switch to "virtual slots" model
-- Slot rows are now created on-demand at first join (findOrCreateSlot).
-- Remove any leftover seeded slots that have no participants.
-- Slots with at least 1 participant are preserved.
-- Run once in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

DELETE FROM public.slots
WHERE id NOT IN (SELECT DISTINCT slot_id FROM public.slot_participants);
