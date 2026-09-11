# ✈ AirportParty

> **Don't wait alone.**
> Find who's flying out near you. A coffee, a beer, a quick chat.

**Live at 👉 [www.airportparty.it](https://www.airportparty.it/)**

AirportParty is a project built **for fun** — a side project to play with Next.js,
Supabase and a polished design system — but it's a real, working app that's publicly
accessible. The idea is simple: airports are full of people waiting for the same flight,
alone, with an hour to kill. AirportParty connects them.

> The app's UI is in **Italian** (its target audience), but this README is in English.

---

## 💡 The idea in two lines

Pick your airport, see the **time slots** where other people are waiting, join one, and
— as the meetup time approaches — a **group chat** opens so you can sort things out and
meet up in person. A pre-flight coffee instead of an hour staring at the departures
board.

The whole interface is **mobile-first**.

---

## 🧭 How it works (user flow)

1. **Pick your airport** (`/airport`) — search by city/code or tap a quick chip
   (MXP, FCO, LIN, BGY, BLQ, NAP).
2. **See who's around today** (`/airport/[code]`) — an hourly timeline of slots
   (06:00 → 22:00) showing how many people have already joined each one.
3. **Join a slot** — pick the time that suits you, add your **destination** and an
   optional note ("pre-flight coffee?").
4. **Wait for the meetup** — you see a **countdown** until then; the group chat unlocks
   automatically **3 hours before** the slot time.
5. **Chat and meet** — a **real-time** group chat with the other participants to agree
   on a meeting point and get to know each other.

You can browse slots **without an account**; signing up is only required when you
actually want to join a slot or post in a chat.

### The "virtual slot" (key detail)

Slots are **not** pre-generated wholesale in the database. The app renders **virtual**
hourly slots client-side; a real row in `slots` is created **only when the first person
joins** that combination (airport + date + time). This keeps the database clean and
free of empty time slots.

---

## 💼 Business logic

AirportParty is, first and foremost, an **experiment / personal project** — not a
commercial product with a monetization funnel. That said, the model it follows is clear
and scalable:

- **User value:** turn dead time at the airport into a social opportunity. Zero
  friction: no matching, no swiping — just "who's here, right now."
- **Local network effect:** value grows with user density **per airport and per time
  slot**. It's a classic chicken-and-egg problem, addressed by focusing on a few
  high-traffic hubs (the 6 initial Italian airports) rather than going broad.
- **Safety & trust:** a slot's chat is readable **only by that slot's participants**
  (enforced at the database level with Row Level Security), and it opens only shortly
  before the meetup — reducing spam and unwanted contact.
- **Possible monetization directions (not implemented):** partnerships with airport
  bars/lounges (a sponsored "meeting point"), time-limited promotions, premium features
  for frequent travelers. All consistent with the core asset: the user's **intent +
  location + time**.

In short: born as a toy, built as if it were real, with a model that — should anyone
ever want to push it — would have a sensible path to growth.

---

## 🛠 Tech stack

| Layer        | Technology                                            |
|--------------|-------------------------------------------------------|
| Framework    | **Next.js 14** (App Router) + React 18 + TypeScript   |
| Styling      | **Tailwind CSS** (clean product design system: Inter, slate + blue) |
| Backend/Auth | **Supabase** (Postgres + Auth + Realtime + RLS)       |
| Realtime     | Supabase Realtime (live chat and participant counts)  |
| Icons        | Lucide React                                          |

The application code lives in [`web/`](web/). The [`project/`](project/) folder holds
the original design files (hi-fi HTML/CSS prototypes) the app was built from.

---

## 🚀 Running locally

```bash
cd web
npm install

# Configure Supabase credentials
cp .env.local.example .env.local
#   → fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

npm run dev          # http://localhost:3000
```

### Database

Run the initial schema against your Supabase project:

1. Open **Supabase Dashboard → SQL Editor → New query**
2. Paste and run [`web/supabase/init.sql`](web/supabase/init.sql)
   (tables, profile trigger, RLS policies, realtime, and airport seeds)
3. Apply any migrations in [`web/supabase/migrations/`](web/supabase/migrations/)

> The `NEXT_PUBLIC_*` keys are public by design: security is enforced by **RLS
> policies**, not by keeping the anon key secret.

---

## 🗂 Project structure

```
.
├── web/                     # The Next.js application
│   ├── app/                 # Routes (App Router): airport, slot, profile, auth…
│   ├── components/          # UI (Button, Avatar, SlotCard, ChatBubble…) and layout
│   ├── lib/                 # Supabase client, API, auth hook, types, utils
│   └── supabase/            # init.sql + migrations
└── project/                 # Original design files (hi-fi HTML/CSS prototypes)
```

---

## 📦 Data model (essentials)

- **profiles** — user (name, email, randomly assigned avatar color)
- **airports** — supported airports (IATA code, city)
- **slots** — time slots per airport/day (created on-demand on the first join)
- **slot_participants** — who joined which slot (+ destination and note)
- **messages** — group chat, readable only by the slot's participants

---

*A side project built for fun · "Cielo" theme · live at
[airportparty.it](https://www.airportparty.it/)*
