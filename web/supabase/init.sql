-- ============================================================================
-- AirportParty — Initial schema
-- Run this entire file in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLES
-- ----------------------------------------------------------------------------

-- profiles: extends auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT '#FFD5B8',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- airports: supported airports
CREATE TABLE IF NOT EXISTS public.airports (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT DEFAULT 'IT'
);

-- slots: time slots per airport per day
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airport_code TEXT NOT NULL REFERENCES public.airports(code),
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 60,
  meeting_point TEXT,
  meeting_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(airport_code, date, start_time)
);

CREATE INDEX IF NOT EXISTS slots_airport_date_idx
  ON public.slots(airport_code, date);

-- slot_participants: who joined which slot
CREATE TABLE IF NOT EXISTS public.slot_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination TEXT,
  note TEXT,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slot_id, user_id)
);

CREATE INDEX IF NOT EXISTS slot_participants_user_idx
  ON public.slot_participants(user_id);

CREATE INDEX IF NOT EXISTS slot_participants_slot_idx
  ON public.slot_participants(slot_id);

-- messages: chat messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID NOT NULL REFERENCES public.slots(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_slot_created_idx
  ON public.messages(slot_id, created_at);


-- ----------------------------------------------------------------------------
-- 2. AUTO-CREATE profile ON signup + assign random avatar color
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  palette TEXT[] := ARRAY[
    '#FFD5B8','#C9E4FF','#FFE2EC','#D8F5C7','#E8D5FF','#FFF3B8'
  ];
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_color)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    palette[floor(random() * array_length(palette, 1) + 1)::int]
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ----------------------------------------------------------------------------
-- 3. RLS — Row Level Security
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Airports — publicly readable
DROP POLICY IF EXISTS "airports_select_all" ON public.airports;
CREATE POLICY "airports_select_all" ON public.airports
  FOR SELECT USING (true);

-- Slots — publicly readable; authenticated users can create on-demand
-- (via findOrCreateSlot when joining a virtual slot for the first time).
DROP POLICY IF EXISTS "slots_select_all" ON public.slots;
CREATE POLICY "slots_select_all" ON public.slots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "slots_insert_authenticated" ON public.slots;
CREATE POLICY "slots_insert_authenticated" ON public.slots
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Slot participants — readable by all, write only own
DROP POLICY IF EXISTS "slot_participants_select_all" ON public.slot_participants;
CREATE POLICY "slot_participants_select_all" ON public.slot_participants
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "slot_participants_insert_own" ON public.slot_participants;
CREATE POLICY "slot_participants_insert_own" ON public.slot_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "slot_participants_delete_own" ON public.slot_participants;
CREATE POLICY "slot_participants_delete_own" ON public.slot_participants
  FOR DELETE USING (auth.uid() = user_id);

-- Messages — readable only by slot participants, write only own + must be participant
DROP POLICY IF EXISTS "messages_select_for_participants" ON public.messages;
CREATE POLICY "messages_select_for_participants" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.slot_participants sp
      WHERE sp.slot_id = messages.slot_id AND sp.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "messages_insert_for_participants" ON public.messages;
CREATE POLICY "messages_insert_for_participants" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.slot_participants sp
      WHERE sp.slot_id = messages.slot_id AND sp.user_id = auth.uid()
    )
  );


-- ----------------------------------------------------------------------------
-- 4. REALTIME — enable change broadcasts on chat + participants
-- ----------------------------------------------------------------------------

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.slot_participants;


-- ----------------------------------------------------------------------------
-- 5. SEED — airports
-- ----------------------------------------------------------------------------

INSERT INTO public.airports (code, name, city, country) VALUES
  ('MXP', 'Milano Malpensa', 'Milano', 'IT'),
  ('FCO', 'Roma Fiumicino', 'Roma', 'IT'),
  ('LIN', 'Milano Linate', 'Milano', 'IT'),
  ('BGY', 'Bergamo Orio al Serio', 'Bergamo', 'IT'),
  ('BLQ', 'Bologna Marconi', 'Bologna', 'IT'),
  ('NAP', 'Napoli Capodichino', 'Napoli', 'IT'),
  ('AHO', 'Alghero Riviera del Corallo', 'Alghero', 'IT'),
  ('AOI', 'Ancona Falconara', 'Ancona', 'IT'),
  ('AOT', 'Aosta Corrado Gex', 'Aosta', 'IT'),
  ('BRI', 'Bari Karol Wojtyła', 'Bari', 'IT'),
  ('BZO', 'Bolzano Dolomiti', 'Bolzano', 'IT'),
  ('VBS', 'Brescia Montichiari', 'Brescia', 'IT'),
  ('BDS', 'Brindisi Papola Casale', 'Brindisi', 'IT'),
  ('CAG', 'Cagliari Elmas', 'Cagliari', 'IT'),
  ('CTA', 'Catania Fontanarossa', 'Catania', 'IT'),
  ('CIY', 'Comiso Pio La Torre', 'Comiso', 'IT'),
  ('CRV', 'Crotone Pitagora', 'Crotone', 'IT'),
  ('CUF', 'Cuneo Levaldigi', 'Cuneo', 'IT'),
  ('FLR', 'Firenze Peretola', 'Firenze', 'IT'),
  ('FOG', 'Foggia Gino Lisa', 'Foggia', 'IT'),
  ('FRL', 'Forlì Luigi Ridolfi', 'Forlì', 'IT'),
  ('GOA', 'Genova Cristoforo Colombo', 'Genova', 'IT'),
  ('GRS', 'Grosseto Corrado Baccarini', 'Grosseto', 'IT'),
  ('SUF', 'Lamezia Terme', 'Lamezia Terme', 'IT'),
  ('LMP', 'Lampedusa', 'Lampedusa', 'IT'),
  ('EBA', 'Elba Marina di Campo', 'Marina di Campo', 'IT'),
  ('OLB', 'Olbia Costa Smeralda', 'Olbia', 'IT'),
  ('PMO', 'Palermo Falcone e Borsellino', 'Palermo', 'IT'),
  ('PMF', 'Parma Giuseppe Verdi', 'Parma', 'IT'),
  ('PEG', 'Perugia San Francesco d''Assisi', 'Perugia', 'IT'),
  ('PSR', 'Pescara Abruzzo', 'Pescara', 'IT'),
  ('PSA', 'Pisa Galileo Galilei', 'Pisa', 'IT'),
  ('REG', 'Reggio Calabria Tito Minniti', 'Reggio Calabria', 'IT'),
  ('RMI', 'Rimini Federico Fellini', 'Rimini', 'IT'),
  ('CIA', 'Roma Ciampino', 'Roma', 'IT'),
  ('TRS', 'Trieste Ronchi dei Legionari', 'Trieste', 'IT'),
  ('QSR', 'Salerno Costa d''Amalfi', 'Salerno', 'IT'),
  ('TAR', 'Taranto Grottaglie', 'Taranto', 'IT'),
  ('TRN', 'Torino Caselle', 'Torino', 'IT'),
  ('TPS', 'Trapani Birgi', 'Trapani', 'IT'),
  ('TSF', 'Treviso Antonio Canova', 'Treviso', 'IT'),
  ('VCE', 'Venezia Marco Polo', 'Venezia', 'IT'),
  ('VRN', 'Verona Villafranca', 'Verona', 'IT'),
  ('ALL', 'Albenga Clemente Panero', 'Albenga', 'IT')
ON CONFLICT (code) DO NOTHING;


-- ----------------------------------------------------------------------------
-- 6. SLOT SEEDING — not needed.
-- Slots are generated client-side as "virtual" placeholders (hourly 06:00–22:00).
-- A row in public.slots is created ONLY when the first user joins that
-- (airport, date, start_time) tuple, via findOrCreateSlot() in lib/api/slots.ts.
-- Empty slots never end up in the DB.
-- ----------------------------------------------------------------------------
