# AirportParty — redesign "prodotto pulito"

Data: 2026-09-11
Stato: approvato dall'autore del progetto in brainstorming

## Perché

Il design attuale (sistema "Cielo": Nunito 800, azzurro pastello, raggi 20px, pillole,
ombre azzurrine, parole colorate nei titoli, emoji e bottoni in minuscolo tipo "join")
risulta giocattoloso. L'obiettivo è un tono da prodotto serio e moderno, nello stile
Linear/Vercel, senza cambiare struttura delle schermate né comportamento.

Direzione scelta tra tre varianti mostrate in mockup: **A · Slate + blu** (neutri
freddi, un solo accento blu saturo, wordmark bicolore conservato).

## Cosa NON cambia

- Layout e flussi delle schermate (aeroporto → slot → join → chat), bottom sheet,
  modale data/ora, split mobile/desktop.
- API dei componenti in `web/components/` (props e nomi restano uguali).
- Claim principali: "Non aspettare da solo.", "Trova chi parte vicino a te. Un caffè,
  una birra, due chiacchiere."
- Colori pastello degli avatar (arrivano dal profilo utente in database).
- Logica, dati, Supabase.

## 1. Token

File: `web/tailwind.config.ts`, `web/app/globals.css`, `web/app/layout.tsx`.

### Tipografia
- Font sans: **Inter** via `next/font/google` (pesi 400, 500, 600, 700), variabile
  `--font-inter`. Nunito viene rimosso del tutto.
- Font mono: JetBrains Mono resta (orari, codici aeroporto, countdown).
- Peso base del body: 400 (oggi 500).
- Titoli di pagina: `font-semibold` con `tracking-tight` (-0.4px). Niente `font-extrabold`.
- Etichette maiuscole (`.label-cap`): 11px, 600, letter-spacing 0.6px (oggi 1.2px),
  colore `ink-soft` (oggi `ink-muted`).

### Colori
| Token          | Nuovo     | Oggi      | Uso |
|----------------|-----------|-----------|-----|
| bg             | #F8FAFC   | #FAFCFF   | sfondo pagina |
| card           | #FFFFFF   | #FFFFFF   | superfici |
| card-alt       | #F1F5F9   | #F0F7FF   | hover, sfondi secondari, tab |
| ink            | #0F172A   | #1B2A3D   | testo principale |
| ink-soft       | #475569   | #6B8299   | testo secondario |
| ink-muted      | #94A3B8   | #A3B8CC   | placeholder, testo terziario |
| line           | #E2E8F0   | #D6E4F0   | bordi |
| primary        | #2563EB   | #3BA0E3   | azioni primarie, link, wordmark |
| primary-soft   | #EFF6FF   | #E8F4FD   | sfondo evidenziato |
| primary-dark   | #1D4ED8   | #2178B5   | hover primario |
| warning        | #D97706   | (accent #FF8A65) | stato "Chat tra poco" |
| warning-soft   | #FFFBEB   | (accent-soft #FFF0EB) | sfondo badge countdown |
| success        | #16A34A   | #34C77B   | |
| error          | #DC2626   | #E84855   | |

`accent` e `accent-soft` vengono rimossi: l'unico uso è lo stato countdown in
`MySlotCard`, che passa a `warning`. Le variabili CSS in `globals.css` seguono
la stessa tabella.

### Forme
- `borderRadius`: DEFAULT 10px (oggi 20px), `sm` 8px (oggi 12px), `pill` 999px resta
  ma solo per avatar, badge di stato e la maniglia del bottom sheet.
- Bordi: 1px ovunque (oggi 1.5px). `borderColor` default resta `line`.
- `boxShadow`: DEFAULT `none`; `lg` diventa `0 8px 24px rgba(15,23,42,0.08)` e si usa
  solo per modale, bottom sheet e il dropdown dei risultati di ricerca.
- `themeColor` nel viewport passa a #2563EB.

## 2. Componenti

Directory: `web/components/`.

### Nuovo: `ui/Card.tsx`
```tsx
type Props = { highlight?: boolean; dashed?: boolean; className?: string; children }
// base: rounded border border-line bg-card
// highlight: border-primary bg-primary-soft
// dashed: border-dashed (stati vuoti, caricamento)
```
Sostituisce i riquadri scritti a mano nelle pagine (31 `rounded-[20px]`, 4
`rounded-[16px]`, 6 `rounded-[24px]`). Il padding resta a carico del chiamante via
`className`, perché varia da 12 a 32px.

Card renderizza un `<div>` e non ha una prop `as`: le superfici il cui elemento radice
deve restare un `<a>`/`<Link>` (MySlotCard), un `<ul>` (menu del profilo) o un
`<form>`/contenitore con dropdown (ricerca aeroporto) mantengono le stesse classi
scritte a mano (`rounded border border-line bg-card`). Eccezione registrata dopo la
review finale.

### Modifiche
- **Button**: `rounded-sm` (8px), testo 14px `font-semibold`, primario `bg-primary
  hover:bg-primary-dark`, secondario `border border-line bg-card hover:bg-card-alt`.
  Nessuna ombra. Resta `active:scale-[0.98]`.
- **Wordmark**: peso 700, letter-spacing -0.4px. Resta bicolore (ink + primary).
- **Tag**: `rounded-sm`, bordo 1px, `font-mono` per i codici aeroporto; `filled` usa
  `bg-card-alt text-ink-soft border-line`.
- **InputField**: `rounded` 10px, bordo 1px, niente ombra, `focus-within:border-primary`.
  Testo 15px peso 500.
- **ChatInput**: contenitore `rounded` 10px invece della pillola, bottone invio
  `rounded-sm`.
- **SegmentedTabs**: contenitore `rounded` 10px con `bg-card-alt`, tab attiva
  `rounded-sm bg-card` con bordo `line` invece dell'ombra.
- **ChatBubble**: `rounded-xl` 12px, mio messaggio `bg-primary`, altrui `border
  border-line bg-card`. Nome mittente e ora restano.
- **PersonRow**: bordo 1px, `rounded-sm`; la freccia "→ destinazione" diventa icona
  Lucide `Plane` 12px seguita dal codice.
- **SlotCard / SlotRow**: usano `Card`; copy "Partecipa" / "Iscritto";
  "0 persone" diventa "Nessuno, per ora".
- **MySlotCard**: stesse classi di `Card` scritte a mano (radice `<Link>`); stato countdown su `warning`; "vedi dettagli →"
  diventa "Vedi dettagli" con icona `ArrowRight`; "→ destinazione" come in PersonRow.
- **BackLink**: la freccia testuale diventa icona Lucide `ArrowLeft` 14px.
- **BottomSheet**: `rounded-t-2xl` (16px), mantiene `shadow-lg`.
- **DateTimeModal**: `rounded-xl` (12px), mantiene `shadow-lg`.
- **NavBar / DesktopNavBar**: link attivo `bg-card-alt text-ink` invece di
  `bg-primary-soft text-primary`; bottone "accedi" diventa "Accedi".
- **Avatar / AvatarStack**: invariati.

## 3. Pagine e copy

Directory: `web/app/`. Passata mirata, pagina per pagina, senza cambiare struttura.

### Regole di stile
- Ogni riquadro con bordo/raggio scritto a mano diventa `<Card>`.
- `border-[1.5px]` → `border`; `shadow` / `shadow-lg` rimossi dalle superfici statiche.
- Titoli: `font-extrabold` → `font-semibold`; `tracking-tightest`/`tighter` →
  `tracking-tight`; via gli `<span className="text-primary">` dentro i titoli.
- I chip giorno nel selettore data: `rounded-sm`, attivo `bg-primary text-white`.
- Le opzioni fascia oraria: `rounded-sm`, radio con bordo 1px.

### Regole di copy
- Bottoni e titoli con iniziale maiuscola. Esempi: "Accedi", "Registrati",
  "Bentornato", "Quasi fatto", "Modifica", "Annulla", "Mostra slot di oggi",
  "Cerca nuovi slot", "Crea account e partecipa", "Entra nel gruppo".
- "join" → "Partecipa"; "✓ joined" → "Iscritto"; "loggato" → "Connesso".
- Separatore "·" nei sottotitoli sostituito da virgola dove è prosa
  ("Slot di oggi, ogni ora"); resta tra dati brevi (città, data, ora).
- Via tutte le emoji e i simboli decorativi: ✈ ✨ 💬 ✦ → ← ✓. Nei titoli e nei
  bottoni non si mette nessuna icona al loro posto. Solo dove il simbolo aveva una
  funzione (freccia "indietro", freccia "destinazione") si usa l'icona Lucide
  corrispondente, come indicato nella sezione Componenti.
- Icone degli input di destinazione e nota: `Plane` e `MessageSquare` (Lucide).
- Stato vuoto in "I miei slot": via l'aeroplano grande, resta titolo e testo.
- "Scegli l'aeroporto → ti mostriamo chi c'è oggi ✈" →
  "Scegli l'aeroporto e ti mostriamo chi c'è oggi."
- "è il momento ✨" → "È il momento"; "apri la chat 💬 →" → "Apri la chat".
- Claim principali invariati.

### Pagine coinvolte
`airport/page.tsx`, `airport/[code]/page.tsx`, `airport/[code]/[slotId]/page.tsx`,
`slot/[slotId]/page.tsx`, `slot/[slotId]/chat/page.tsx`, `join/[slotId]/page.tsx`,
`my-slots/page.tsx`, `profile/page.tsx`, `login/page.tsx`, `signup/page.tsx`,
`forgot-password/page.tsx`, `auth/reset-password/page.tsx`.

## 4. Verifica

Il progetto non ha test automatici. Criteri di accettazione:

1. `npm run typecheck`, `npm run lint`, `npm run build` passano.
2. Grep a zero risultati in `web/app` e `web/components` per: `Nunito`,
   `rounded-\[`, `border-\[1.5px\]`, `font-extrabold`, `accent`, e per i simboli
   `✈ ✨ 💬 ✦ → ← ✓`.
3. Screenshot mobile (390px) e desktop (1280px) di ogni pagina, confrontati con il
   mockup A: font Inter, raggi 10/8px, nessuna ombra su card statiche, titoli
   monocolore, copy maiuscolo.
4. Comportamenti invariati: ricerca aeroporto, filtro data/fascia, join, countdown,
   chat realtime, login/signup.

## Fuori scopo

- Dark mode.
- Cambi di layout o nuove schermate.
- Refactor dei primitivi oltre a `Card`.
- Cartella `project/` (prototipi HTML originali): resta com'è.
