-- ============================================================================
-- Migration: convert slots from 30-min to hourly granularity, duration 60min
-- Run once in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

-- 1. Cambia il default per nuovi insert
ALTER TABLE public.slots ALTER COLUMN duration_minutes SET DEFAULT 60;

-- 2. Elimina gli slot della mezz'ora (XX:30) che non hanno ancora partecipanti.
--    Quelli con partecipanti vengono preservati (se hai test data da non perdere
--    li tratteremo a parte). On delete cascade su slot_participants e messages.
DELETE FROM public.slots
WHERE EXTRACT(MINUTE FROM start_time) <> 0
  AND id NOT IN (SELECT DISTINCT slot_id FROM public.slot_participants);

-- 3. Aggiorna la durata degli slot rimasti (ora-piene) a 60 minuti
UPDATE public.slots SET duration_minutes = 60 WHERE duration_minutes <> 60;

-- 4. (Opzionale) Re-seed per assicurarti che gli slot orari per i prossimi 3 giorni
--    siano presenti su tutti gli aeroporti
INSERT INTO public.slots (airport_code, date, start_time, duration_minutes, meeting_point, meeting_note)
SELECT
  a.code,
  d::date,
  make_time(h, 0, 0),
  60,
  'Bar Terminal 1',
  'vicino gate B · landside'
FROM public.airports a
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', INTERVAL '1 day') d
CROSS JOIN generate_series(6, 22) h
ON CONFLICT (airport_code, date, start_time) DO NOTHING;
