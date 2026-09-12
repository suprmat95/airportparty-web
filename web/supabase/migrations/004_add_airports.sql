-- ============================================================================
-- Migration: add all ENAC-certified Italian airports
-- Source: aeroporti_certificati.csv (ENAC). Extends the initial 6-airport seed
-- to the full list of 44 certified airports. Idempotent.
-- Run once in Supabase Dashboard → SQL Editor → New query
-- ============================================================================

INSERT INTO public.airports (code, name, city, country) VALUES
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
