# AirportParty — Developer Handoff

> **Stack:** Next.js 14 (App Router) + Supabase + Tailwind CSS
> **Target:** Web app mobile-first (PWA-ready)
> **Lingua UI:** Italiano

---

## 1. Cos'è AirportParty

Un'app che connette viaggiatori nello stesso aeroporto. Scegli il tuo aeroporto, trovi gli "slot" (fasce orarie) con altre persone che aspettano, ti unisci a uno slot, e quando mancano 3 ore al meetup si apre una chat di gruppo per organizzarvi.

**Tagline:** *"Non aspettare da solo."*

---

## 2. Flusso utente

```
GUEST FLOW:
  Splash (A0) → Aeroporto (S00) → Timeline slot (S01) → Dettaglio slot (S02)
    → [se guest] Registrazione + slot info (S03B) → Countdown (S04) → Chat ready (S04b) → Chat (S05)
    → [se loggato] Slot info (S03A) → Countdown (S04) → Chat ready (S04b) → Chat (S05)

AUTH FLOW:
  Splash (A0) → Login (A1) | Signup (A2) | Forgot password (A3)
  Profile (A4) — accessibile da menu

NAVIGAZIONE:
  / ........................ Splash/Landing (A0)
  /airport ................. Selezione aeroporto (S00)
  /airport/[code] ......... Timeline slot di oggi (S01)
  /airport/[code]/[slotId]  Dettaglio slot (S02)
  /join/[slotId] .......... Join slot — form info (S03A se loggato, S03B se guest)
  /slot/[slotId] .......... Countdown + stato slot (S04 / S04b)
  /slot/[slotId]/chat ..... Chat di gruppo (S05)
  /login .................. Login (A1)
  /signup ................. Signup (A2)
  /forgot-password ........ Reset password (A3)
  /profile ................ Profilo utente (A4)
```

---

## 3. Design Tokens

Usa queste CSS custom properties (tema "Cielo"):

```css
:root {
  /* Primari */
  --primary: #3BA0E3;
  --primary-soft: #E8F4FD;
  --primary-dark: #2178B5;

  /* Accent */
  --accent: #FF8A65;
  --accent-soft: #FFF0EB;

  /* Superfici */
  --bg: #FAFCFF;
  --card: #FFFFFF;
  --card-alt: #F0F7FF;

  /* Testo */
  --ink: #1B2A3D;
  --ink-soft: #6B8299;
  --ink-muted: #A3B8CC;

  /* Feedback */
  --border: #D6E4F0;
  --success: #34C77B;
  --error: #E84855;

  /* Radii */
  --radius: 20px;
  --radius-sm: 12px;
  --radius-pill: 999px;

  /* Ombre */
  --shadow: 0 2px 12px rgba(59, 160, 227, 0.08);
  --shadow-lg: 0 8px 32px rgba(59, 160, 227, 0.12);

  /* Font */
  --font: 'Nunito', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

### Tailwind config (tailwind.config.js)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3BA0E3', soft: '#E8F4FD', dark: '#2178B5' },
        accent: { DEFAULT: '#FF8A65', soft: '#FFF0EB' },
        bg: '#FAFCFF',
        card: { DEFAULT: '#FFFFFF', alt: '#F0F7FF' },
        ink: { DEFAULT: '#1B2A3D', soft: '#6B8299', muted: '#A3B8CC' },
        border: '#D6E4F0',
        success: '#34C77B',
        error: '#E84855',
      },
      borderRadius: {
        DEFAULT: '20px',
        sm: '12px',
        pill: '999px',
      },
      boxShadow: {
        DEFAULT: '0 2px 12px rgba(59,160,227,0.08)',
        lg: '0 8px 32px rgba(59,160,227,0.12)',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

## 4. Tipografia

| Ruolo | Size | Weight | Tracking |
|-------|------|--------|----------|
| Heading XL | 34px | 800 | -0.8px |
| Heading L | 22px | 800 | -0.5px |
| Heading M | 16px | 700 | -0.2px |
| Body | 15px | 600 | -0.2px |
| Body Small | 13px | 500 | — |
| Caption | 11px | 500 | — |
| Label (uppercase) | 11px | 700 | 1.2px, uppercase |
| Mono (orari, codici) | JetBrains Mono | 700 | — |

**Google Fonts import:**
```
Nunito:wght@400;500;600;700;800
JetBrains+Mono:wght@400;700
```

---

## 5. Componenti UI

### 5.1 Button (`<Button>`)

| Prop | Valori | Default |
|------|--------|---------|
| variant | `primary` / `secondary` | `secondary` |
| size | `sm` / `md` | `md` |
| fullWidth | boolean | false |

```
primary md:   bg primary, text white, rounded-pill, py-3.5 px-6, font-bold shadow
primary sm:   bg primary, text white, rounded-pill, py-2 px-4, text-sm font-bold
secondary md: bg transparent, border 1.5px border, rounded-pill, py-3.5 px-6, font-bold
secondary sm: bg transparent, border 1.5px border, rounded-pill, py-2 px-4, text-sm font-bold
```

### 5.2 InputField (`<InputField>`)

| Prop | Tipo |
|------|------|
| label | string (uppercase, 11px/700, ink-muted) |
| placeholder | string |
| icon | string (emoji) |
| value | string |

```
Container: border 1.5px border, rounded-[20px], p-3.5 px-4, bg card, shadow, flex items-center gap-2.5
```

### 5.3 Tag / Chip (`<Tag>`)

| Prop | Tipo |
|------|------|
| variant | `outline` / `filled` |

```
outline: border 1.5px border, rounded-pill, px-3 py-1.5, text-xs font-semibold, color ink-soft
filled:  bg primary-soft, rounded-pill, px-3 py-1.5, text-xs font-semibold, color primary-dark
```

### 5.4 Avatar (`<Avatar>`)

| Prop | Tipo |
|------|------|
| initials | string (1-2 chars) |
| color | string (one of avatar palette) |
| size | number (px) |

```
Cerchio con bg color, border 2px card, box-shadow 0 0 0 1px border
Font size = size × 0.42, font-weight 700
```

**Palette avatar:** `#FFD5B8` (Peach), `#C9E4FF` (Sky), `#FFE2EC` (Pink), `#D8F5C7` (Mint), `#E8D5FF` (Lavender), `#FFF3B8` (Lemon)

### 5.5 AvatarStack (`<AvatarStack>`)

Mostra fino a 4 avatar sovrapposti (margin-left: -8px) + badge "+N" se ce ne sono di più.

### 5.6 SlotCard (`<SlotCard>`)

Card per uno slot nella timeline. Props: `time`, `going` (numero persone), `highlight` (boolean).

```
highlight=true:  border primary, bg primary-soft
highlight=false: border border, bg card
Contiene: orario (font-mono, 18px/700), avatar stack, count persone, button join/joined
```

### 5.7 PersonRow (`<PersonRow>`)

Riga persona nella lista slot. Props: `name`, `destination`, `note`, `avatar`, `isMe`.

```
isMe=true:  border primary, bg primary-soft
isMe=false: border border, bg card
Layout: avatar | nome + "→ DEST · nota" | 
```

### 5.8 Wordmark (`<Wordmark>`)

Logo testuale: `airport` in ink + `party` in primary. Font principale, weight 800, letter-spacing -0.8px.

### 5.9 ChatBubble (`<ChatBubble>`)

| Prop | Tipo |
|------|------|
| isMe | boolean |
| from | string |
| text | string |
| time | string |

```
isMe=true:  bg primary, text white, rounded-2xl, allineato a destra
isMe=false: bg card, border 1.5px border, rounded-2xl, allineato a sinistra
Sotto: orario in font-mono 9px ink-muted
```

---

## 6. Icone

Stile: **outline sottili**, SVG con `strokeWidth: 2`, `strokeLinecap: round`, `strokeLinejoin: round`, `fill: none`.

Usa **Lucide React** (`lucide-react`) — le icone nel design sono compatibili Lucide:
- `ArrowLeft` (navigazione back)
- `Search` (ricerca aeroporto)
- `Edit` (modifica filtri)
- `Send` (invio messaggio chat)
- `User` (profilo)
- `Clock` (orari)
- `Lock` (chat locked / password)
- `ChevronRight` (menu items)

---

## 7. Schema Database (Supabase)

### Tabelle

```sql
-- Utenti (estende auth.users di Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_color TEXT DEFAULT '#FFD5B8',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Aeroporti supportati
CREATE TABLE airports (
  code TEXT PRIMARY KEY,        -- es. 'MXP', 'FCO'
  name TEXT NOT NULL,           -- es. 'Milano Malpensa'
  city TEXT NOT NULL,           -- es. 'Milano'
  country TEXT DEFAULT 'IT'
);

-- Slot (fasce orarie per aeroporto per giorno)
CREATE TABLE slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  airport_code TEXT REFERENCES airports(code) NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,       -- es. '13:30'
  duration_minutes INT DEFAULT 30,
  meeting_point TEXT,              -- es. 'Bar Terminal 1'
  meeting_note TEXT,               -- es. 'vicino gate B · landside'
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(airport_code, date, start_time)
);

-- Partecipazioni agli slot
CREATE TABLE slot_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES slots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  destination TEXT,                -- es. 'BCN'
  note TEXT,                       -- es. 'caffè pre-volo?'
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(slot_id, user_id)
);

-- Messaggi chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id UUID REFERENCES slots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

```sql
-- Profiles: ognuno legge tutti, modifica solo il proprio
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Slots: leggibili da tutti
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Slots viewable by everyone" ON slots FOR SELECT USING (true);

-- Slot participants: leggibili da tutti, insert/delete solo per sé
ALTER TABLE slot_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Participants viewable by everyone" ON slot_participants FOR SELECT USING (true);
CREATE POLICY "Users can join slots" ON slot_participants FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave slots" ON slot_participants FOR DELETE USING (auth.uid() = user_id);

-- Messages: leggibili dai partecipanti dello slot, insert solo per sé
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages viewable by slot participants" ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM slot_participants sp WHERE sp.slot_id = messages.slot_id AND sp.user_id = auth.uid()
  ));
CREATE POLICY "Participants can send messages" ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (SELECT 1 FROM slot_participants sp WHERE sp.slot_id = messages.slot_id AND sp.user_id = auth.uid())
  );
```

### Realtime

Abilita Realtime su:
- `messages` — per la chat live
- `slot_participants` — per aggiornare il conteggio persone in tempo reale

---

## 8. Struttura progetto consigliata

```
airportparty/
├── app/
│   ├── layout.tsx                  # Root layout, fonts, global styles
│   ├── page.tsx                    # Splash / Landing (A0)
│   ├── airport/
│   │   ├── page.tsx                # Selezione aeroporto (S00)
│   │   └── [code]/
│   │       ├── page.tsx            # Timeline slot (S01)
│   │       └── [slotId]/
│   │           └── page.tsx        # Dettaglio slot (S02)
│   ├── join/
│   │   └── [slotId]/
│   │       └── page.tsx            # Join form (S03A / S03B)
│   ├── slot/
│   │   └── [slotId]/
│   │       ├── page.tsx            # Countdown (S04 / S04b)
│   │       └── chat/
│   │           └── page.tsx        # Chat di gruppo (S05)
│   ├── login/
│   │   └── page.tsx                # Login (A1)
│   ├── signup/
│   │   └── page.tsx                # Signup (A2)
│   ├── forgot-password/
│   │   └── page.tsx                # Reset password (A3)
│   └── profile/
│       └── page.tsx                # Profilo (A4)
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── InputField.tsx
│   │   ├── Tag.tsx
│   │   ├── Avatar.tsx
│   │   ├── AvatarStack.tsx
│   │   ├── SlotCard.tsx
│   │   ├── PersonRow.tsx
│   │   ├── ChatBubble.tsx
│   │   └── Wordmark.tsx
│   ├── layout/
│   │   ├── MobileShell.tsx         # Container mobile max-width + padding
│   │   ├── NavBar.tsx              # Header con back + wordmark
│   │   └── ChatInput.tsx           # Barra input messaggio
│   └── providers/
│       └── SupabaseProvider.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   ├── server.ts               # Server client
│   │   └── middleware.ts            # Auth middleware
│   ├── types.ts                     # TypeScript types per le tabelle
│   └── utils.ts                     # Helper (formatTime, countdown, etc.)
├── public/
│   └── manifest.json               # PWA manifest
├── tailwind.config.js
└── package.json
```

---

## 9. Specifiche per pagina

### S00 — Selezione aeroporto (`/airport`)
- Hero: titolo "non aspettare **da solo**." (primary su "da solo")
- Campo ricerca con icona search
- Quick chips: MXP, FCO, LIN, BGY, BLQ, NAP
- Click chip o ricerca → naviga a `/airport/[code]`

### S01 — Timeline (`/airport/[code]`)
- Header: back + wordmark + tag aeroporto (filled)
- Barra data/ora con filtri
- Titolo: "chi c'è **oggi** a Malpensa?"
- Timeline verticale con linea tratteggiata a sinistra
- Lista SlotCard — click → `/airport/[code]/[slotId]`
- **Data:** `GET slots WHERE airport_code = [code] AND date = today, JOIN count(slot_participants)`

### S02 — Dettaglio slot (`/airport/[code]/[slotId]`)
- Header card con orario, aeroporto, data, avatar stack
- Info card: punto ritrovo + durata
- Lista persone (PersonRow)
- CTA: "join · entra nel gruppo ✈" → `/join/[slotId]`
- **Data:** `GET slot + slot_participants JOIN profiles`

### S03A — Join (loggato) (`/join/[slotId]`)
- Mostra info slot + account attuale
- Form: destinazione + nota opzionale
- Submit → `INSERT slot_participants` → redirect a `/slot/[slotId]`

### S03B — Join (guest) (`/join/[slotId]`)
- Step 1: Crea account (nome, email, password)
- Step 2: Info per lo slot (destinazione, nota)
- Checkbox termini
- Submit → `auth.signUp` + `INSERT slot_participants` → redirect a `/slot/[slotId]`

### S04 — Countdown (`/slot/[slotId]`)
- Header slot
- Box countdown: ore:min:sec fino a 3h prima del meetup
- Lista persone con badge "(tu)" per l'utente corrente
- **Logica:** `slot.start_time - 3 ore = chat_opens_at`. Timer JS con `setInterval`.

### S04b — Chat ready (`/slot/[slotId]`)
- Stesso layout di S04 ma il box countdown diventa "La chat è aperta ✨"
- CTA: "apri la chat 💬 →" → `/slot/[slotId]/chat`
- Link "esci dallo slot" → `DELETE slot_participants`

### S05 — Chat (`/slot/[slotId]/chat`)
- Header: orario + punto ritrovo + avatar stack
- Banner info: "Chat aperta · meetup alle 13:30 al Bar T1"
- Lista messaggi (ChatBubble) — **Supabase Realtime subscription**
- Input bar con campo testo + bottone send
- **Realtime:** subscribe a `messages WHERE slot_id = [slotId]`

### A0 — Splash (`/`)
- Logo ✈ + wordmark
- Tagline
- CTA: "crea account" → `/signup`
- CTA: "ho già un account · login" → `/login`
- Link: "esplora senza account →" → `/airport`

### A1 — Login (`/login`)
- Email + password
- "Password dimenticata?" → `/forgot-password`
- Submit → `auth.signInWithPassword`

### A2 — Signup (`/signup`)
- Nome, email, password, conferma password
- Checkbox termini
- Submit → `auth.signUp` + `INSERT profiles`

### A3 — Forgot password (`/forgot-password`)
- Email
- Submit → `auth.resetPasswordForEmail`
- Info box: "Il link scade dopo 1 ora"

### A4 — Profile (`/profile`)
- Avatar grande + nome + email
- Stats: slot fatti, incontri, aeroporti (query aggregate)
- Menu: I miei slot, Notifiche, Sicurezza, Impostazioni, Aiuto
- Link: "esci · logout" → `auth.signOut`

---

## 10. Logica chiave

### Apertura chat
```
chat_opens_at = slot.date + slot.start_time - 3 ore
SE now() >= chat_opens_at → mostra S04b (chat ready)
SE now() < chat_opens_at → mostra S04 (countdown)
```

### Generazione slot automatica
Gli slot per ogni aeroporto possono essere generati automaticamente per ogni giornata (es. ogni 30 minuti dalle 6:00 alle 23:00). Usa un cron job Supabase (pg_cron) o una Edge Function schedulata.

### Assegnazione avatar color
Alla creazione del profilo, assegna casualmente uno dei 6 colori avatar:
`['#FFD5B8', '#C9E4FF', '#FFE2EC', '#D8F5C7', '#E8D5FF', '#FFF3B8']`

---

## 11. Dipendenze npm

```json
{
  "dependencies": {
    "next": "^14",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2",
    "@supabase/ssr": "^0.5",
    "lucide-react": "latest",
    "tailwindcss": "^3",
    "date-fns": "^3"
  }
}
```

---

## 12. Seed data per development

```sql
-- Aeroporti italiani
INSERT INTO airports (code, name, city) VALUES
  ('MXP', 'Milano Malpensa', 'Milano'),
  ('FCO', 'Roma Fiumicino', 'Roma'),
  ('LIN', 'Milano Linate', 'Milano'),
  ('BGY', 'Bergamo Orio al Serio', 'Bergamo'),
  ('BLQ', 'Bologna Marconi', 'Bologna'),
  ('NAP', 'Napoli Capodichino', 'Napoli');

-- Slot esempio per oggi a MXP
INSERT INTO slots (airport_code, date, start_time, duration_minutes, meeting_point, meeting_note) VALUES
  ('MXP', CURRENT_DATE, '13:00', 30, 'Bar Terminal 1', 'vicino gate B · landside'),
  ('MXP', CURRENT_DATE, '13:30', 30, 'Bar Terminal 1', 'vicino gate B · landside'),
  ('MXP', CURRENT_DATE, '14:00', 30, 'Bar Terminal 1', 'vicino gate B · landside'),
  ('MXP', CURRENT_DATE, '14:30', 30, 'Bar Terminal 1', 'vicino gate B · landside');
```

---

## 13. Come usare questo documento con Claude Code

Apri Claude Code e incolla:

> Sto costruendo AirportParty, una web app Next.js + Supabase + Tailwind. Ho un documento di handoff completo in `HANDOFF-Claude-Code.md` con tutti i design tokens, componenti, schema DB, routing e specifiche per pagina. Leggilo e inizia a scaffoldare il progetto. Partiamo dal setup iniziale: Next.js app, Supabase client, Tailwind config con i token del design system, e i componenti UI base (Button, InputField, Tag, Avatar, Wordmark).

Poi procedi pagina per pagina seguendo il flusso: S00 → S01 → S02 → S03 → S04 → S05, e infine l'auth (A0-A4).

---

*Generato dal design hi-fi AirportParty · tema Cielo · Maggio 2025*
