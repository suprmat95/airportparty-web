-- ============================================================================
-- Migration: allow authenticated users to create slots
-- Required since slots are now materialized on-demand at first join
-- (findOrCreateSlot) instead of being pre-seeded.
-- Run once in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

DROP POLICY IF EXISTS "slots_insert_authenticated" ON public.slots;
CREATE POLICY "slots_insert_authenticated" ON public.slots
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
