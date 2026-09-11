# Clean Product Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sostituire il design system "Cielo" (Nunito, azzurro pastello, raggi 20px, pillole, emoji) con la direzione "prodotto pulito" variante A (Inter, slate + blu #2563EB, raggi 10/8px, bordi 1px, niente ombre, copy italiano con iniziale maiuscola), senza cambiare layout, comportamento o API dei componenti.

**Architecture:** Prima i token (Tailwind + CSS + font), poi i componenti in `web/components/` (più un nuovo `Card`), poi una passata pagina per pagina in `web/app/`. Uno script bash di guardia (`web/scripts/check-design.sh`) fa da test: grep dei residui del vecchio design, rosso all'inizio, verde alla fine. Ogni task termina con typecheck, guardia parziale e commit.

**Tech Stack:** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3.4, `next/font/google`, lucide-react, clsx (`cn` in `web/lib/utils.ts`).

**Spec:** `docs/superpowers/specs/2026-09-11-clean-product-redesign-design.md`

## Global Constraints

- Tutti i comandi si lanciano da `web/` (`cd web`). Node 20, npm 10.
- Non esiste ESLint config: **non** usare `npm run lint`. Verifica = `npm run typecheck` + `bash scripts/check-design.sh` + `npm run build` (solo nell'ultimo task).
- Nessun cambio a props, nomi o firme dei componenti esistenti. Nessun cambio a `lib/`.
- Font sans: Inter (400, 500, 600, 700) via `next/font/google`, variabile `--font-inter`. Nunito rimosso ovunque.
- Palette A (esatta): bg `#F8FAFC`, card `#FFFFFF`, card-alt `#F1F5F9`, ink `#0F172A`, ink-soft `#475569`, ink-muted `#94A3B8`, line `#E2E8F0`, primary `#2563EB`, primary-soft `#EFF6FF`, primary-dark `#1D4ED8`, warning `#D97706`, warning-soft `#FFFBEB`, success `#16A34A`, error `#DC2626`. I token `accent` / `accent-soft` spariscono.
- Raggi: `rounded` = 10px, `rounded-sm` = 8px, `rounded-pill` = 999px (solo avatar, badge di stato, maniglia sheet). Bordi 1px. `shadow` default = none; `shadow-lg` solo su modale, bottom sheet e dropdown ricerca.
- Titoli: `font-semibold tracking-tight`. Vietati `font-extrabold`, `tracking-tightest`, `tracking-tighter`, `<span className="text-primary">` dentro i titoli.
- Copy: bottoni e titoli con iniziale maiuscola; "join" → "Partecipa", "✓ joined" → "Iscritto", "0 persone" → "Nessuno, per ora", "loggato" → "Connesso". Vietati i simboli `✈ ✨ 💬 ✦ → ← ✓` nel JSX. Claim invariati: "Non aspettare da solo.", "Trova chi parte vicino a te. Un caffè, una birra, due chiacchiere."
- Commit dopo ogni task, messaggi in inglese, con il trailer di attribuzione indicato dalla sessione.
- `web/package-lock.json` è già modificato da `npm install`: va incluso nel commit del Task 1.

---

### Task 1: Script di guardia + token (Tailwind, CSS, font)

**Files:**
- Create: `web/scripts/check-design.sh`
- Modify: `web/tailwind.config.ts` (intero file)
- Modify: `web/app/globals.css` (intero file)
- Modify: `web/app/layout.tsx:1-20` (import font) e `:33` (themeColor)
- Modify: `web/package.json:5-11` (script `check:design`)

**Interfaces:**
- Produces: classi Tailwind `bg-warning`, `bg-warning-soft`, `text-warning`, `border-warning`, `rounded` (10px), `rounded-sm` (8px), `rounded-pill`, `tracking-tight`, `tracking-label`, `shadow-lg`; variabile CSS `--font-inter`. Le classi `*-accent`, `*-accent-soft`, `tracking-tightest`, `tracking-tighter` **non esistono più** (Tailwind le ignora silenziosamente: per questo serve la guardia).

- [ ] **Step 1: Scrivere lo script di guardia (il "test")**

```bash
#!/usr/bin/env bash
# Guardia del redesign: fallisce se restano residui del design "Cielo".
# Uso: bash scripts/check-design.sh            → controlla app/ e components/
#      bash scripts/check-design.sh components → controlla solo components/
set -u
cd "$(dirname "$0")/.."
targets="${1:-app components}"
fail=0

check() {
  local label="$1" pattern="$2" hits
  # shellcheck disable=SC2086
  hits=$(grep -rnE --include='*.tsx' --include='*.ts' --include='*.css' "$pattern" $targets 2>/dev/null || true)
  if [ -n "$hits" ]; then
    echo "✗ $label"
    echo "$hits" | head -20
    fail=1
  else
    echo "✓ $label"
  fi
}

check "font Nunito"                 'Nunito|font-nunito'
check "raggi scritti a mano"        'rounded(-t|-b)?-\[[0-9]+px\]'
check "bordi 1.5px"                 'border-\[1\.5px\]'
check "font-extrabold"              'font-extrabold'
check "tracking vecchi"             'tracking-tightest|tracking-tighter'
check "token accent (corallo)"      '(bg|text|border)-accent(-soft)?\b|--accent'
check "parole colorate nei titoli"  '<span className="text-primary">'
check "simboli decorativi"          '✈|✨|💬|✦|→|←|✓'
check "ombre su superfici statiche" "['\" ]shadow['\" ]"

exit $fail
```

Aggiungere in `web/package.json` dentro `"scripts"`:

```json
"check:design": "bash scripts/check-design.sh"
```

Nota sulla regola "ombre": la classe `shadow` (default) sparisce del tutto, perché nel nuovo config vale `none`. La regex cerca `shadow` delimitato da spazio o virgolette, quindi `shadow-lg` e `hover:shadow-lg` non matchano.

- [ ] **Step 2: Eseguire la guardia e verificare che fallisce**

Run: `cd web && bash scripts/check-design.sh`
Expected: exit 1, con `✗` su tutte e nove le righe. Esempi di hit attesi: `app/layout.tsx` per Nunito, `components/ui/SlotCard.tsx` per `rounded-[20px]`, `border-[1.5px]` e `✓`, `components/ui/MySlotCard.tsx` per `text-accent`, `app/airport/page.tsx` per `font-extrabold` e `<span className="text-primary">`.

- [ ] **Step 3: Sostituire `web/tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          soft: '#EFF6FF',
          dark: '#1D4ED8',
        },
        warning: {
          DEFAULT: '#D97706',
          soft: '#FFFBEB',
        },
        bg: '#F8FAFC',
        card: {
          DEFAULT: '#FFFFFF',
          alt: '#F1F5F9',
        },
        ink: {
          DEFAULT: '#0F172A',
          soft: '#475569',
          muted: '#94A3B8',
        },
        line: '#E2E8F0',
        success: '#16A34A',
        error: '#DC2626',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm: '8px',
        pill: '999px',
      },
      boxShadow: {
        DEFAULT: 'none',
        lg: '0 8px 24px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        tight: '-0.4px',
        label: '0.6px',
      },
      borderColor: {
        DEFAULT: '#E2E8F0',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Sostituire `web/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #2563eb;
  --primary-soft: #eff6ff;
  --primary-dark: #1d4ed8;
  --warning: #d97706;
  --warning-soft: #fffbeb;
  --bg: #f8fafc;
  --card: #ffffff;
  --card-alt: #f1f5f9;
  --ink: #0f172a;
  --ink-soft: #475569;
  --ink-muted: #94a3b8;
  --line: #e2e8f0;
  --success: #16a34a;
  --error: #dc2626;
  --radius: 10px;
  --radius-sm: 8px;
  --radius-pill: 999px;
  --shadow-lg: 0 8px 24px rgba(15, 23, 42, 0.08);
}

html,
body {
  background: var(--bg);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-inter), system-ui, sans-serif;
  font-weight: 400;
}

.label-cap {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-soft);
  text-transform: uppercase;
  letter-spacing: 0.6px;
}
```

- [ ] **Step 5: Aggiornare il font in `web/app/layout.tsx`**

Sostituire le righe 1–13 (import e definizione di `nunito`) con:

```tsx
import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});
```

Poi:
- `themeColor: '#3BA0E3'` → `themeColor: '#2563EB'`
- `className={`${nunito.variable} ${jetbrainsMono.variable}`}` → `className={`${inter.variable} ${jetbrainsMono.variable}`}`

- [ ] **Step 6: Typecheck e guardia parziale**

Run: `cd web && npm run typecheck && grep -rn 'Nunito\|font-nunito' app components; echo "exit=$?"`
Expected: typecheck senza errori; il grep non trova nulla (`exit=1`).

- [ ] **Step 7: Avviare il dev server e guardare una pagina**

Run: `cd web && (npm run dev > /tmp/ap-dev.log 2>&1 &) && sleep 6 && curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/airport`
Expected: `200`. Aprendo http://localhost:3000/airport nel browser il testo è in Inter (le "a" a due piani, niente forme tonde di Nunito) e il blu del wordmark è #2563EB. I bottoni sono ancora a pillola: è atteso, cambiano nel Task 2.

- [ ] **Step 8: Commit**

```bash
cd web && git add scripts/check-design.sh tailwind.config.ts app/globals.css app/layout.tsx package.json package-lock.json
git commit -m "Design tokens: Inter, slate+blue palette, 10/8px radii, no default shadow

Adds scripts/check-design.sh, a grep guard that fails while any
Cielo-era leftover (Nunito, hand-written radii, 1.5px borders,
extrabold titles, accent tokens, decorative symbols) remains."
```

---

### Task 2: `Card` + primitivi base (Button, Tag, Wordmark, InputField)

**Files:**
- Create: `web/components/ui/Card.tsx`
- Modify: `web/components/ui/Button.tsx:13-24`
- Modify: `web/components/ui/Tag.tsx:12-19`
- Modify: `web/components/ui/Wordmark.tsx:10-18`
- Modify: `web/components/ui/InputField.tsx:15-31`

**Interfaces:**
- Produces: `Card` con firma
  ```ts
  type CardProps = React.HTMLAttributes<HTMLDivElement> & { highlight?: boolean; dashed?: boolean };
  export function Card(props: CardProps): JSX.Element
  ```
  Rende un `<div>` con `rounded border border-line bg-card` (+ `border-primary bg-primary-soft` se `highlight`, + `border-dashed` se `dashed`), e inoltra `className` e gli altri attributi (onClick, role, ecc.). **Il padding non è incluso**: lo passa il chiamante.
- Consumes: token del Task 1.

- [ ] **Step 1: Creare `web/components/ui/Card.tsx`**

```tsx
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Bordo e sfondo primario (slot evidenziato, stato attivo). */
  highlight?: boolean;
  /** Bordo tratteggiato (stati vuoti, caricamento). */
  dashed?: boolean;
};

export function Card({ highlight, dashed, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded border bg-card',
        highlight ? 'border-primary bg-primary-soft' : 'border-line',
        dashed && 'border-dashed',
        className
      )}
      {...rest}
    />
  );
}
```

- [ ] **Step 2: Aggiornare `Button.tsx`**

Sostituire le costanti `base`, `variants`, `sizes` (righe 13–24) con:

```ts
const base =
  'inline-flex items-center justify-center gap-1.5 rounded-sm font-semibold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'bg-card text-ink border border-line hover:bg-card-alt',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[13px]',
  md: 'px-5 py-3 text-[14px]',
};
```

- [ ] **Step 3: Aggiornare `Tag.tsx`**

Sostituire il `className` (righe 12–18) con:

```tsx
className={cn(
  'inline-flex items-center rounded-sm border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.3px]',
  variant === 'outline' && 'border-line bg-card text-ink-soft',
  variant === 'filled' && 'border-line bg-card-alt text-ink-soft',
  className
)}
```

- [ ] **Step 4: Aggiornare `Wordmark.tsx`**

Nel `style` (righe 10–18): `fontFamily: 'var(--font-inter), system-ui, sans-serif'`, `fontWeight: 700`, `letterSpacing: '-0.4px'`. Il resto (colore ink + span primary) resta.

- [ ] **Step 5: Aggiornare `InputField.tsx`**

Sostituire il contenitore (righe 15–20) e l'`<input>` (righe 27–30) con:

```tsx
<div
  className={cn(
    'flex items-center gap-2.5 rounded border border-line bg-card px-3.5 py-3 transition focus-within:border-primary',
    className
  )}
>
  ...
  <input
    ref={ref}
    className="flex-1 bg-transparent text-[15px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none"
    {...rest}
  />
```

- [ ] **Step 6: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh components 2>&1 | grep -E 'Button|Tag|Wordmark|InputField|Card'; echo "hit su questi file: $?"`
Expected: typecheck ok; nessun hit sui cinque file (`hit su questi file: 1`). La guardia complessiva fallisce ancora per gli altri componenti: atteso.

Nel browser (http://localhost:3000/airport): bottone "accedi" rettangolare con angoli 8px, chip MXP/FCO con bordo 1px e font mono, campo ricerca senza ombra.

- [ ] **Step 7: Commit**

```bash
cd web && git add components/ui/Card.tsx components/ui/Button.tsx components/ui/Tag.tsx components/ui/Wordmark.tsx components/ui/InputField.tsx
git commit -m "Restyle base primitives and add Card

Button/Tag/InputField move to 8-10px radii, 1px borders and no
shadows; Wordmark uses Inter 700. Card centralises the bordered
surface used across pages."
```

---

### Task 3: Componenti restanti (lista, chat, navigazione, overlay)

**Files:**
- Modify: `web/components/ui/SlotCard.tsx`
- Modify: `web/components/ui/SlotRow.tsx`
- Modify: `web/components/ui/MySlotCard.tsx`
- Modify: `web/components/ui/PersonRow.tsx`
- Modify: `web/components/ui/ChatBubble.tsx:30-35`
- Modify: `web/components/ui/SegmentedTabs.tsx:30-53`
- Modify: `web/components/layout/ChatInput.tsx:12,27-42`
- Modify: `web/components/layout/BackLink.tsx`
- Modify: `web/components/layout/NavBar.tsx:20`
- Modify: `web/components/layout/DesktopNavBar.tsx:37-41,68-70`
- Modify: `web/components/layout/BottomSheet.tsx:45`
- Modify: `web/components/layout/DateTimeModal.tsx:45`

**Interfaces:**
- Consumes: `Card` (Task 2). Nessuna prop cambia.

- [ ] **Step 1: `SlotCard.tsx` (intero file)**

```tsx
import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { Button } from './Button';
import { Card } from './Card';

type Props = {
  time: string;
  going: number;
  avatars: AvatarStackItem[];
  highlight?: boolean;
  joined?: boolean;
  onJoin?: () => void;
};

export function peopleLabel(going: number): string {
  if (going === 0) return 'Nessuno, per ora';
  return `${going} ${going === 1 ? 'persona' : 'persone'}`;
}

export function SlotCard({ time, going, avatars, highlight, joined, onJoin }: Props) {
  return (
    <Card highlight={highlight} className="flex items-center justify-between p-3.5">
      <div>
        <div className="font-mono text-lg font-bold leading-none text-ink">{time}</div>
        <div className="mt-1.5 flex items-center gap-2">
          {going > 0 && <AvatarStack items={avatars} size={22} />}
          <span className="text-xs font-medium text-ink-soft">{peopleLabel(going)}</span>
        </div>
      </div>
      <Button variant={highlight || joined ? 'primary' : 'secondary'} size="sm" onClick={onJoin}>
        {joined ? 'Iscritto' : 'Partecipa'}
      </Button>
    </Card>
  );
}
```

`peopleLabel` è esportata e riusata da `SlotRow` (sotto): unica fonte per il copy "Nessuno, per ora".

- [ ] **Step 2: `SlotRow.tsx` (intero file)**

```tsx
import { AvatarStack, type AvatarStackItem } from './AvatarStack';
import { Button } from './Button';
import { Card } from './Card';
import { peopleLabel } from './SlotCard';

type Props = {
  time: string;
  going: number;
  avatars: AvatarStackItem[];
  highlight?: boolean;
  joined?: boolean;
  onJoin?: () => void;
};

export function SlotRow({ time, going, avatars, highlight, joined, onJoin }: Props) {
  return (
    <Card
      highlight={highlight}
      className="flex w-full items-center gap-5 px-5 py-4 transition hover:border-ink-muted"
    >
      <div className="min-w-[80px] font-mono text-[24px] font-bold leading-none text-ink">
        {time}
      </div>

      <div className="h-10 w-px bg-line" aria-hidden />

      <div className="flex flex-1 items-center gap-3">
        {going > 0 && <AvatarStack items={avatars} size={28} />}
        <span className="text-[13px] font-medium text-ink-soft">{peopleLabel(going)}</span>
      </div>

      <Button
        variant={highlight || joined ? 'primary' : 'secondary'}
        size="sm"
        onClick={onJoin}
      >
        {joined ? 'Iscritto' : 'Partecipa'}
      </Button>
    </Card>
  );
}
```

- [ ] **Step 3: `MySlotCard.tsx`**

Modifiche puntuali:
- Import: aggiungere `import { ArrowRight, Clock, Plane } from 'lucide-react';` (al posto di `import { Clock } from 'lucide-react';`).
- `STATUS_CLASSES.countdown`: `'bg-accent-soft text-accent'` → `'bg-warning-soft text-warning'`.
- Il `<Link>` esterno (righe 53–59): className →
  ```tsx
  className={cn(
    'block rounded border bg-card p-4 transition hover:border-ink-muted',
    isCountdown ? 'border-warning' : 'border-line',
    isDone && 'opacity-70'
  )}
  ```
- Destinazione (righe 68–72):
  ```tsx
  {destination && (
    <span className="inline-flex items-center gap-1 font-mono text-[12px] font-semibold text-ink-soft">
      <Plane className="h-3 w-3" strokeWidth={2} />
      {destination}
    </span>
  )}
  ```
- Riga "vedi dettagli →" (righe 91–95):
  ```tsx
  {isCountdown && (
    <div className="mt-3 flex items-center gap-1 border-t border-line pt-3 text-[12px] font-semibold text-warning">
      Vedi dettagli
      <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
    </div>
  )}
  ```
- `StatusBadge` (riga 104): `font-bold` → `font-semibold`.
- `CountdownBadge`: riga 128 `font-bold` → `font-semibold`; riga 134 `bg-accent-soft ... text-accent` → `bg-warning-soft px-3 py-1 text-[11px] font-semibold text-warning`.

- [ ] **Step 4: `PersonRow.tsx`**

- Import: `import { Plane } from 'lucide-react';`
- `detail` (righe 15–17) diventa solo la nota: `const detail = note ? note : null;`
- Contenitore (riga 22): `'flex items-center gap-2.5 rounded-sm border-[1.5px] px-3 py-2'` → `'flex items-center gap-2.5 rounded-sm border px-3 py-2'`.
- Nome (riga 28): `font-bold` → `font-semibold`.
- Sotto il nome sostituire il blocco `{detail && (...)}` con:
  ```tsx
  {(destination || detail) && (
    <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
      {destination && (
        <span className="inline-flex items-center gap-1 font-mono">
          <Plane className="h-3 w-3" strokeWidth={2} />
          {destination}
        </span>
      )}
      {destination && detail && <span aria-hidden>·</span>}
      {detail && <span>{detail}</span>}
    </div>
  )}
  ```

- [ ] **Step 5: `ChatBubble.tsx`**

Riga 31–33: `'rounded-2xl px-3 py-2 text-[13px] font-medium leading-snug'` → `'rounded-xl px-3 py-2 text-[13px] font-normal leading-snug'`; e `'border-[1.5px] border-line bg-card text-ink'` → `'border border-line bg-card text-ink'`.

- [ ] **Step 6: `SegmentedTabs.tsx`**

- Contenitore (riga 30): `'rounded-pill bg-card-alt p-1'` → `'rounded bg-card-alt p-1'`.
- Tab (riga 44): `'flex items-center justify-center gap-1.5 rounded-pill px-4 py-2 text-[13px] font-bold transition'` → `'flex items-center justify-center gap-1.5 rounded-sm px-4 py-2 text-[13px] font-semibold transition'`.
- Attiva (riga 47): `'bg-card text-ink shadow'` → `'border border-line bg-card text-ink'`; inattiva: aggiungere `border border-transparent` → `'border border-transparent text-ink-soft hover:text-ink'`.
- Contatore (riga 53): `'rounded-pill px-1.5 py-0.5 font-mono text-[10px]'` → `'rounded-sm px-1.5 py-0.5 font-mono text-[10px]'`.

- [ ] **Step 7: `ChatInput.tsx`**

- Placeholder default (riga 12): `'scrivi un messaggio…'` → `'Scrivi un messaggio…'`.
- Contenitore (riga 27): `'flex items-center gap-2 rounded-pill border-[1.5px] border-line bg-card px-4 py-2 shadow'` → `'flex items-center gap-2 rounded border border-line bg-card px-3.5 py-2'`.
- Input (riga 33): `font-semibold` → `font-medium`, `placeholder:font-medium` → `placeholder:font-normal`.
- Bottone invio (riga 39): `rounded-pill` → `rounded-sm`; aria-label `"invia"` → `"Invia"`.

- [ ] **Step 8: `BackLink.tsx` (intero file)**

```tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  href: string;
  label?: string;
  className?: string;
};

export function BackLink({ href, label = 'Indietro', className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft transition hover:text-ink',
        className
      )}
    >
      <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      {label}
    </Link>
  );
}
```

- [ ] **Step 9: `NavBar.tsx` e `DesktopNavBar.tsx`**

`NavBar.tsx` riga 20: `rounded-pill` → `rounded-sm`; `aria-label="indietro"` → `aria-label="Indietro"`.

`DesktopNavBar.tsx`:
- righe 37–41: `'rounded-pill px-3.5 py-1.5 text-sm font-semibold transition'` → `'rounded-sm px-3 py-1.5 text-sm font-medium transition'`; attivo `'bg-primary-soft text-primary'` → `'bg-card-alt text-ink'`.
- riga 69: `accedi` → `Accedi`.

- [ ] **Step 10: `BottomSheet.tsx` e `DateTimeModal.tsx`**

- `BottomSheet.tsx` riga 45: `rounded-t-[28px]` → `rounded-t-2xl`. Resta `shadow-lg`.
- `DateTimeModal.tsx` riga 45: `rounded-[24px]` → `rounded-xl`. Resta `shadow-lg`.

- [ ] **Step 11: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh components`
Expected: typecheck ok; **tutte le righe ✓, exit 0** (i componenti sono puliti). `bash scripts/check-design.sh` completo fallisce ancora per `app/`: atteso.

Nel browser, http://localhost:3000/airport/mxp: righe slot con angoli 10px, bordo 1px, bottone "Partecipa"; slot vuoti mostrano "Nessuno, per ora" senza avatar.

- [ ] **Step 12: Commit**

```bash
cd web && git add components
git commit -m "Restyle list, chat, navigation and overlay components

Slot rows and cards use Card and the new Partecipa/Iscritto copy,
countdown state moves from coral accent to amber warning, arrows and
check marks become Lucide icons."
```

---

### Task 4: Pagine aeroporto (`airport/page.tsx`, `airport/[code]/page.tsx`)

**Files:**
- Modify: `web/app/airport/page.tsx`
- Modify: `web/app/airport/[code]/page.tsx`

**Interfaces:**
- Consumes: `Card`, `Button`, `Tag`, `SlotCard`, `SlotRow`, `BackLink` (Task 2–3).

- [ ] **Step 1: Sostituzioni meccaniche su entrambi i file**

Run (da `web/`):
```bash
for f in app/airport/page.tsx "app/airport/[code]/page.tsx"; do
  sed -i '' \
    -e 's/border-\[1\.5px\]/border/g' \
    -e 's/font-extrabold/font-semibold/g' \
    -e 's/tracking-tightest/tracking-tight/g' \
    -e 's/tracking-tighter/tracking-tight/g' \
    -e 's/rounded-\[20px\]/rounded/g' \
    -e 's/rounded-\[16px\]/rounded-sm/g' \
    -e 's/rounded-\[12px\]/rounded-sm/g' \
    -e 's/ shadow-lg//g' \
    -e "s/ shadow'/'/g" \
    -e 's/ shadow"/"/g' \
    -e 's/ shadow / /g' \
    "$f"
done
```
Nota: `sed -i ''` è la sintassi macOS (BSD sed, che non supporta `\b`). Su Linux usare `sed -i`. Dopo il comando, `git diff --stat` deve mostrare solo i file toccati; un rapido `grep -n shadow <file>` conferma che restano solo eventuali `shadow-lg` da ripristinare come indicato negli step successivi.

- [ ] **Step 2: `app/airport/page.tsx` — modifiche puntuali**

- Dropdown risultati (ex riga 78): il `<ul>` deve riavere l'ombra: `'mt-2 overflow-hidden rounded-sm border border-line bg-card shadow-lg'`.
- Risultato ricerca (ex riga 86–89): `font-bold` → `font-semibold` sul nome; codice `font-mono text-[13px] font-bold text-primary` → `font-mono text-[13px] font-semibold text-ink-soft`.
- Campo ricerca (ex riga 66): `'flex items-center gap-3 rounded border border-line bg-card px-4 py-4'` (già senza ombra dopo sed) + aggiungere `focus-within:border-primary`. Input (ex riga 73): `font-semibold` → `font-medium`, `placeholder:font-medium` → `placeholder:font-normal`.
- Bottone "accedi" mobile (ex riga 121): testo → `Accedi`.
- Titolo mobile (ex righe 126–130) e desktop (ex righe 154–158): rimuovere lo span:
  ```tsx
  <h1 className="mb-1.5 text-[34px] font-semibold leading-[1.05] tracking-tight text-ink">
    Non aspettare
    <br />
    da solo.
  </h1>
  ```
  (desktop: stesso contenuto, `text-[48px]` e `mb-3`).
- Sottotitolo (`<p>` sotto i titoli, mobile e desktop): `font-medium` → `font-normal`.
- Etichetta chip (ex righe 135 e 161): `o scegli al volo` → `Oppure scegli al volo`.
- Footer (ex righe 141–143 e 165–167): `Scegli l’aeroporto → ti mostriamo chi c’è oggi ✈` → `Scegli l’aeroporto e ti mostriamo chi c’è oggi.`

- [ ] **Step 3: `app/airport/[code]/page.tsx` — modifiche puntuali**

- Import: aggiungere `import { Card } from '@/components/ui/Card';`.
- Sottotitoli (ex righe 218–219 e 250): `'slot di oggi · ogni ora'` → `'Slot di oggi, ogni ora'`; `` `${ctaLabel(date, today)} · ogni ora` `` → `` `${ctaLabel(date, today)}, ogni ora` ``. Le classi `font-semibold text-ink-soft` sui sottotitoli → `font-medium text-ink-soft`.
- Bottone matita mobile (ex riga 288): `rounded-pill border border-line` → `rounded-sm border border-line`; `aria-label="modifica data e fascia oraria"` → `aria-label="Modifica data e fascia oraria"`.
- Titolo mobile (ex righe 294–297) e desktop (ex righe 490–492): rimuovere lo span:
  ```tsx
  <h1 className="mb-5 text-[26px] font-semibold leading-[1.1] tracking-tight text-ink">
    Chi c’è {heroLabel}
    <br />a {airportShort}?
  </h1>
  ```
  (desktop: `text-[34px]`, senza `<br />`).
- Stati "Caricamento slot…" e "Nessuno slot in questa fascia" (4 occorrenze, mobile ex righe 312–322, desktop ex righe 495–503): sostituire il `<div className="... border-dashed ...">` con `<Card dashed className="ml-6 p-5 text-center text-[13px] font-medium text-ink-soft">` (mobile) e `<Card dashed className="p-8 text-center text-[14px] font-medium text-ink-soft">` (desktop). Copy: `Nessuno slot in questa fascia · prova a allargare i filtri` → `Nessuno slot in questa fascia. Prova ad allargare i filtri.`
- Link mobile "← cambia aeroporto" (ex righe 380–385): sostituire il `<Link>` con `<BackLink href="/airport" label="Cambia aeroporto" className="mx-auto" />` dentro un `<div className="mt-6 flex justify-center">`. `BackLink` è già importato.
- Card riepilogo desktop (ex riga 471): `<div className="mb-5 flex items-center justify-between gap-3 rounded border border-line bg-card p-4">` → `<Card className="mb-5 flex items-center justify-between gap-3 p-4">` (chiudere con `</Card>`). Testo data `font-bold` → `font-semibold`; sottotitolo `font-semibold` → `font-medium`. Bottone: `modifica` → `Modifica`.
- Bottom sheet e modale, titolo `Quando parti?` (ex righe 395 e 528): `font-semibold tracking-tight` (già dopo sed). Chip giorno (ex riga 415 e 545): `rounded-sm border px-2 py-2.5` (già), attivo `'border-primary bg-primary text-white'` (togliere `shadow` se sopravvissuto). Etichetta giorno `font-bold` → `font-semibold`; il numero resta mono bold.
- Opzioni fascia oraria (ex righe 449 e 580): `rounded-sm border` (già); etichetta `font-bold` → `font-semibold`.
- CTA sheet/modale: `` mostra slot · {ctaLabel(draftDate, today)} `` → `` Mostra slot di {ctaLabel(draftDate, today)} `` (ctaLabel restituisce "oggi", "domani" o "ven 12": "Mostra slot di oggi", "Mostra slot di ven 12"). Bottone `annulla` → `Annulla`.
- Pallino timeline mobile (ex riga 336): `border-[2px] border-line` → `border-2 border-line` (già valido, ma senza parentesi quadre).

- [ ] **Step 4: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh 2>&1 | grep -E 'app/airport/' ; echo "hit airport: $?"`
Expected: typecheck ok; `hit airport: 1` (nessun residuo nelle due pagine).

Browser: http://localhost:3000/airport e http://localhost:3000/airport/mxp a 390px e 1280px. Titoli monocolore in Inter semibold, card senza ombra, "Partecipa" sui bottoni, sheet con "Mostra slot di oggi".

- [ ] **Step 5: Commit**

```bash
cd web && git add app/airport
git commit -m "Restyle airport picker and timeline pages"
```

---

### Task 5: Pagine slot (`airport/[code]/[slotId]`, `slot/[slotId]`, `slot/[slotId]/chat`)

**Files:**
- Modify: `web/app/airport/[code]/[slotId]/page.tsx`
- Modify: `web/app/slot/[slotId]/page.tsx`
- Modify: `web/app/slot/[slotId]/chat/page.tsx`

- [ ] **Step 1: Sostituzioni meccaniche** (stesso comando sed del Task 4, sui tre file).

- [ ] **Step 2: `airport/[code]/[slotId]/page.tsx`**

- Import: `import { Card } from '@/components/ui/Card';` e `import { ArrowRight } from 'lucide-react';` (accanto a `Clock`).
- CTA (ex righe 118–127):
  ```tsx
  const cta = joined ? (
    <Link href={`/slot/${slot.id}`} className={buttonClass('primary', 'md', true)}>
      Apri lo slot
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  ) : (
    <Link href={`/join/${slot.id}`} className={buttonClass('primary', 'md', true)}>
      Partecipa
    </Link>
  );
  ```
- Lista vuota (ex righe 131–135): `<li>` → `<Card dashed className="p-4 text-center text-[13px] font-medium text-ink-soft">Ancora nessuno. Sii il primo.</Card>` avvolto nel `<li>`.
- Box orario mobile (ex riga 161) e desktop (ex riga 226): `<div className="mb-4 rounded border border-line bg-card p-4">` → `<Card className="mb-4 p-4">` / `<Card className="p-6">`. Sottotitoli `font-semibold` → `font-medium`.
- Box punto ritrovo mobile (ex riga 183) e desktop (ex riga 245): `<div className="... bg-card-alt p-4">` → `<Card className="mb-5 bg-card-alt p-4">` / `<Card className="mt-4 bg-card-alt p-5">`. Titolo `font-bold` → `font-semibold`. Etichette: `punto ritrovo` → `Punto di ritrovo`, `chi c’è` → `Chi c’è`, `finestra di {n} min` → `Finestra di {n} minuti`.

- [ ] **Step 3: `slot/[slotId]/page.tsx`**

- Import: `Card`; `import { ArrowRight, Clock } from 'lucide-react';`.
- Countdown aperto (ex righe 116–131):
  ```tsx
  <Card highlight className="p-5 text-center lg:p-7">
    <div className="label-cap text-primary-dark">La chat è aperta</div>
    <div className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-ink lg:text-[32px]">
      È il momento
    </div>
    <p className="mt-1 text-[13px] font-normal text-ink-soft">
      Coordinatevi con il gruppo per il meetup.
    </p>
    <Link href={`/slot/${slot.id}/chat`} className={buttonClass('primary', 'md', true, 'mt-4')}>
      Apri la chat
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </Link>
  </Card>
  ```
- Countdown chiuso (ex righe 132–146): contenitore → `<Card className="p-5 text-center lg:p-7">`; etichetta `la chat si apre tra` → `La chat si apre tra`; testo finale `3 ore prima del meetup` resta.
- `TimeCell` (ex riga 263): `rounded-sm border border-line bg-card-alt` (già dopo sed).
- Box orario mobile (ex riga 172) e desktop (ex riga 208): `<Card className="mb-4 p-4">` / `<Card className="mb-6 flex items-center justify-between p-5">`. Sottotitoli `font-semibold` → `font-medium`.
- Etichetta `nel gruppo` (2 occorrenze) → `Nel gruppo`.
- Badge desktop `✓ sei dentro` (ex riga 224): `<span className="rounded-pill bg-success/15 px-3 py-1 text-[11px] font-semibold text-success">Sei iscritto</span>`.
- Bottone esci (2 occorrenze): `{leaving ? 'esco…' : 'esci dallo slot'}` → `{leaving ? 'Uscita…' : 'Esci dallo slot'}`.

- [ ] **Step 4: `slot/[slotId]/chat/page.tsx`**

- Import: `Card`; `import { ArrowLeft, Lock, Plane, Send } from 'lucide-react';`.
- Chat chiusa (ex righe 121–136): `h2` → `text-[20px] font-semibold tracking-tight`, testo `la chat è ancora chiusa` → `La chat è ancora chiusa`; link `← torna allo slot` →
  ```tsx
  <Link href={`/slot/${slot.id}`} className={buttonClass('secondary', 'md', false, 'mt-5')}>
    <ArrowLeft className="h-4 w-4" strokeWidth={2} />
    Torna allo slot
  </Link>
  ```
  Icona lucchetto (ex riga 118): `rounded-pill bg-card-alt` → `rounded bg-card-alt`.
- Header mobile (ex riga 163): `<div className="mb-3 flex items-center justify-between rounded border border-line bg-card p-3">` → `<Card className="mb-3 flex items-center justify-between p-3">`. Sottotitolo `font-semibold` → `font-medium`.
- Banner "Chat aperta" mobile (ex riga 174) e desktop (ex riga 249): `border border-primary/30 bg-primary-soft` (già); copy `Chat aperta · meetup alle {slot.startTime} al {slot.meetingPoint}` → `Chat aperta. Meetup alle {slot.startTime} al {slot.meetingPoint}.`
- Placeholder (ex righe 193 e 271): `'scrivi un messaggio…'` → `'Scrivi un messaggio…'`; `'fai join per scrivere'` → `'Partecipa allo slot per scrivere'`.
- Sidebar desktop: etichetta `partecipanti · {n}` → `Partecipanti · {n}`; nome `font-bold` → `font-semibold`; destinazione `→ {p.destination}` →
  ```tsx
  <div className="flex items-center gap-1 truncate text-[11px] font-medium text-ink-soft">
    <Plane className="h-3 w-3" strokeWidth={2} />
    {p.destination}
  </div>
  ```
- `ChatInputBar` (entrambe le varianti, ex righe 320 e 344): contenitore `rounded-pill border border-line ... px-4 py-2` → `rounded border border-line ... px-3.5 py-2`; input `font-semibold` → `font-medium`, `placeholder:font-medium` → `placeholder:font-normal`; bottone `rounded-pill` → `rounded-sm`; `aria-label="invia"` → `aria-label="Invia"`.

- [ ] **Step 5: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh 2>&1 | grep -E 'app/(airport/\[code\]/\[slotId\]|slot)/' ; echo "hit slot: $?"`
Expected: typecheck ok; `hit slot: 1`.

Browser: http://localhost:3000/airport/mxp/<id di uno slot virtuale, cliccando una riga> a 390px e 1280px: box orario senza ombra, "Partecipa" come CTA, "Ancora nessuno. Sii il primo." tratteggiato.

- [ ] **Step 6: Commit**

```bash
cd web && git add "app/airport/[code]/[slotId]" app/slot
git commit -m "Restyle slot detail, status and chat pages"
```

---

### Task 6: Pagine join, i miei slot, profilo

**Files:**
- Modify: `web/app/join/[slotId]/page.tsx`
- Modify: `web/app/my-slots/page.tsx`
- Modify: `web/app/profile/page.tsx`

- [ ] **Step 1: Sostituzioni meccaniche** (comando sed del Task 4, sui tre file).

- [ ] **Step 2: `join/[slotId]/page.tsx`**

- Import: `Card`; `import { Lock, Mail, MessageSquare, Plane, User } from 'lucide-react';`.
- Etichette InputField: `nome` → `Nome`, `email` → `Email`, `password` → `Password`, `destinazione` → `Destinazione`, `nota (opzionale)` → `Nota (opzionale)`.
- Icone testuali (ex righe 227 e 234): `icon="✈"` → `icon={<Plane className="h-5 w-5" strokeWidth={2} />}`; `icon="✦"` → `icon={<MessageSquare className="h-5 w-5" strokeWidth={2} />}`.
- `loggedAccount` (ex riga 209): `<div className="flex items-center gap-3 rounded border border-line bg-card-alt p-3">` → `<Card className="flex items-center gap-3 bg-card-alt p-3">`; nome `font-bold` → `font-semibold`; `loggato` → `Connesso`.
- `errorBox` (ex riga 258): `rounded-sm border border-error/30 bg-error/10 ... font-semibold` → `... font-medium`.
- `submitButton` (ex righe 264–271):
  ```tsx
  {submitting ? 'Attendi…' : isGuest ? 'Crea account e partecipa' : 'Partecipa'}
  ```
- Titoli mobile (ex righe 279–285) e desktop (ex righe 335–341):
  ```tsx
  <h1 className="mb-1 text-[26px] font-semibold leading-[1.1] tracking-tight text-ink">
    {isGuest ? `Entra nel gruppo delle ${slot.startTime}` : 'Quasi fatto'}
  </h1>
  ```
  (desktop `text-[32px]`, `mb-5`).
- Sottotitolo mobile (ex riga 286): `font-medium` → `font-normal`; `ore {startTime}` con `font-bold` → `font-semibold`.
- Etichette sezione: `crea il tuo account` → `Crea il tuo account`, `le tue info per lo slot` → `Le tue info per lo slot` (4 occorrenze).
- Card riepilogo desktop (ex riga 322): `<Card className="mb-6 flex items-center justify-between p-5">`; orario `font-bold` resta (mono); sottotitolo `font-semibold` → `font-medium`.

- [ ] **Step 3: `my-slots/page.tsx`**

- Import: `Card`.
- Titolo (ex righe 130–132): `I miei <span className="text-primary">slot</span>` → `I miei slot`, classi `font-semibold tracking-tight` (dopo sed).
- Sottotitolo (ex riga 134): `font-medium` → `font-normal`.
- `emptyState` (ex righe 140–150):
  ```tsx
  const emptyState = (
    <Card dashed className="p-8 text-center">
      <div className="text-[14px] font-semibold text-ink">Nessuno slot qui</div>
      <p className="mt-1 text-[12px] font-normal text-ink-soft">
        {tab === 'today' && 'Niente di programmato per oggi.'}
        {tab === 'upcoming' && 'Nessuno slot futuro a cui ti sei unito.'}
        {tab === 'past' && 'Non hai slot passati registrati.'}
      </p>
    </Card>
  );
  ```
- Stati "Caricamento…" (ex righe 168 e 224): `<Card dashed className="p-8 text-center text-[13px] font-medium text-ink-soft">Caricamento…</Card>`.
- CTA (ex righe 192 e 205): `cerca nuovi slot ✈` → `Cerca nuovi slot`.

- [ ] **Step 4: `profile/page.tsx`**

- Import: `Card`.
- Titoli `h1` (2) e `h2` (1): `font-semibold tracking-tight` (dopo sed).
- Menu mobile (ex riga 95) e desktop (ex riga 160): `<ul className="mb-5 overflow-hidden rounded border border-line bg-card">`; voci `font-bold` → `font-medium`.
- Logout (ex righe 118 e 178): `esci · logout` → `Esci`.
- Card profilo desktop (ex riga 130): `<Card className="p-6 text-center">`; link `modifica profilo` → `Modifica profilo`.
- Statistiche desktop (ex riga 148): `<Card className="mt-4 grid grid-cols-3 gap-2 p-3">`.
- `Stat` (ex riga 198): `<Card className="p-3 text-center">`.

- [ ] **Step 5: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh 2>&1 | grep -E 'app/(join|my-slots|profile)/' ; echo "hit: $?"`
Expected: typecheck ok; `hit: 1`.

Browser (serve login): http://localhost:3000/join/<slotId>, /my-slots, /profile a 390px e 1280px. Titolo "Entra nel gruppo delle 15:00" monocolore, icone aereo e messaggio negli input, stato vuoto senza aeroplano gigante.

- [ ] **Step 6: Commit**

```bash
cd web && git add app/join app/my-slots app/profile
git commit -m "Restyle join, my-slots and profile pages"
```

---

### Task 7: Pagine auth (login, signup, forgot-password, reset-password)

**Files:**
- Modify: `web/app/login/page.tsx`
- Modify: `web/app/signup/page.tsx`
- Modify: `web/app/forgot-password/page.tsx`
- Modify: `web/app/auth/reset-password/page.tsx`

- [ ] **Step 1: Sostituzioni meccaniche** (comando sed del Task 4, sui quattro file). Poi **ripristinare** `shadow-lg` sulla card desktop centrata di ciascuna pagina (`<div className="rounded border border-line bg-card p-8">` → aggiungere ` shadow-lg`): è l'unica superficie "modale" di queste pagine e la spec la ammette.

- [ ] **Step 2: Copy e classi comuni alle quattro pagine**

- Etichette InputField: `email` → `Email`, `password` → `Password`, `nome` → `Nome`, `conferma password` → `Conferma password`, `nuova password` → `Nuova password`.
- Box errore: `font-semibold` → `font-medium`.
- Sottotitoli `<p>` sotto i titoli: `font-medium` → `font-normal`.
- Link in fondo pagina (`font-bold text-primary`) → `font-semibold text-primary`; testo `accedi` → `Accedi`, `registrati` → `Registrati`, `torna al login` → `Torna al login`.

- [ ] **Step 3: Per pagina**

`login/page.tsx`:
- `password dimenticata?` → `Password dimenticata?`
- Bottone: `{submitting ? 'accedo…' : 'accedi'}` → `{submitting ? 'Accesso…' : 'Accedi'}`
- Titoli `bentornato` (2) → `Bentornato`

`signup/page.tsx`:
- Bottone: `{submitting ? 'creo account…' : 'Crea account ✈'}` → `{submitting ? 'Creazione…' : 'Crea account'}`

`forgot-password/page.tsx`:
- Import `Card`. Box "sent" (ex riga 34): `<Card highlight className="p-4 text-[13px] font-medium text-primary-dark">Controlla la tua email: il link scade dopo 1 ora.</Card>`
- `securityNote` (ex riga 58): `rounded-sm border border-line bg-card-alt` (già dopo sed).
- Bottone: `{submitting ? 'invio…' : 'invia link'}` → `{submitting ? 'Invio…' : 'Invia link'}`
- Titoli `reset password` (2) → `Reimposta la password`

`auth/reset-password/page.tsx`:
- Import `Card`. Box "done" (ex riga 51): `<Card highlight className="p-4 text-[13px] font-medium text-primary-dark">Password aggiornata. Ti stiamo portando dentro…</Card>`
- Bottone: `{submitting ? 'aggiorno…' : 'imposta password'}` → `{submitting ? 'Aggiornamento…' : 'Imposta password'}`
- Titoli `nuova password` (2) → `Nuova password`

- [ ] **Step 4: Verifica**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh`
Expected: typecheck ok; **tutte le righe ✓, exit 0**. Questo è il traguardo della guardia: se resta un ✗, l'output indica file e riga.

Browser: /login, /signup, /forgot-password a 390px e 1280px.

- [ ] **Step 5: Commit**

```bash
cd web && git add app/login app/signup app/forgot-password app/auth
git commit -m "Restyle auth pages"
```

---

### Task 8: Verifica finale end-to-end

**Files:** nessuna modifica prevista (solo fix di regressioni trovate qui).

- [ ] **Step 1: Build di produzione**

Run: `cd web && npm run typecheck && bash scripts/check-design.sh && npm run build`
Expected: tutti e tre a exit 0. `next build` può stampare "No ESLint configuration detected": è un avviso, non un errore.

- [ ] **Step 2: Screenshot di tutte le pagine**

Con il dev server attivo, per ciascuna route a 390px e 1280px:
`/airport`, `/airport/mxp`, `/airport/mxp/<slotId>` (click su una riga), `/login`, `/signup`, `/forgot-password`, e da loggati `/join/<slotId>`, `/slot/<slotId>`, `/slot/<slotId>/chat`, `/my-slots`, `/profile`.

Checklist visiva per ogni screenshot:
- font Inter (nessuna forma tonda di Nunito), titoli semibold monocolore
- card con angoli 10px, bordo 1px grigio #E2E8F0, nessuna ombra (eccetto modale, sheet, dropdown ricerca, card auth desktop)
- bottoni 8px, primario #2563EB, testo con iniziale maiuscola
- nessuna emoji o freccia testuale

- [ ] **Step 3: Verifica comportamenti invariati**

Manualmente nel browser:
1. Ricerca aeroporto: digitare "mil" mostra Malpensa e Linate; invio apre il primo.
2. Filtro data/fascia: aprire il sheet, scegliere "domani" + "Sera", "Mostra slot di domani" filtra la lista.
3. Join: da uno slot virtuale, "Partecipa" → form → submit → redirect a `/slot/<id>` con countdown.
4. Chat: con uno slot entro 3 ore, la chat apre e un messaggio inviato compare.
5. Logout da /profile riporta a /airport.

- [ ] **Step 4: Aggiornare la nota sul design system nel README**

In `README.md` (root), tabella "Tech stack", riga Styling: `**Tailwind CSS** (the "Cielo" design system)` → `**Tailwind CSS** (clean product design system: Inter, slate + blue)`.

- [ ] **Step 5: Commit finale**

```bash
git add README.md
git commit -m "Update README design system note"
```

Poi invocare la skill `superpowers:finishing-a-development-branch` per decidere come integrare `main-2` in `main`.
