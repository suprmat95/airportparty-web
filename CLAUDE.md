# AirportParty

App Next.js 14 (App Router) + Supabase per incontrare chi aspetta il tuo stesso volo in aeroporto.
Live su www.airportparty.it. UI in italiano, README e codice in inglese.

## Dove sta il codice

- `web/` — l'applicazione. Tutti i comandi npm vanno lanciati da qui.
- `web/app/` route, `web/components/{ui,layout,providers}/` UI, `web/lib/` client Supabase, api, tipi, utils.
- `web/supabase/init.sql` + `web/supabase/migrations/` — schema. Ogni modifica allo schema va in una nuova migration numerata, non in `init.sql`.
- `docs/superpowers/specs/` e `docs/superpowers/plans/` — spec e piani delle feature.
- `project/` — prototipi HTML/JSX del design originale. Solo riferimento storico, non modificarli e non copiarne lo stile.

## Comandi

```bash
cd web
npm run dev            # http://localhost:3000
npm run typecheck      # tsc --noEmit
npm run check:design   # guardia del design system, deve restare verde
```

- Non usare `npm run lint`: non c'è una config ESLint e il comando apre un prompt interattivo.
- Non lanciare `npm run build` mentre il dev server è attivo: entrambi scrivono in `web/.next/` e il dev server si rompe.
- Non esiste una test suite: `typecheck` + `check:design` sono la verifica prima di dichiarare un lavoro finito.

## Supabase: attenzione, è produzione

`web/.env.local` punta al progetto Supabase live. Non c'è staging: join, slot e messaggi creati in locale
compaiono sul sito pubblico. Evita dati di prova rumorosi e cancellali se li crei.
Le chiavi `NEXT_PUBLIC_*` sono pubbliche by design: la sicurezza sta nelle policy RLS.

## Regole di dominio

- **Slot virtuali**: gli slot orari (06:00–22:00) sono renderizzati lato client. Una riga in `slots`
  nasce solo al primo join di quella combinazione aeroporto + data + ora. Non pre-generare slot.
- La chat di uno slot si sblocca 3 ore prima dell'orario ed è leggibile solo dai partecipanti (RLS).
- Si può navigare senza account; il login serve solo per join e chat.

## Design system (redesign "clean product", settembre 2026)

Spec: `docs/superpowers/specs/2026-09-11-clean-product-redesign-design.md`.

- Font Inter, neutri slate, un solo accento `#2563EB`, radius 10px (card) / 8px (controlli), bordi 1px.
- Niente ombre sulle card statiche, titoli monocromatici, copy italiano con iniziale maiuscola.
- Vietati i residui del vecchio tema "Cielo": Nunito, pastelli, radius scritti a mano, `font-extrabold`,
  token `accent`. `npm run check:design` li intercetta.
- `Card` renderizza solo un `<div>` (nessuna prop `as`): i root che sono link o `<li>` tengono classi a mano di proposito.

## Convenzioni

- TypeScript strict, Tailwind con i token definiti in `tailwind.config.ts`; niente colori hex inline nei componenti (eccezioni: `themeColor` in `app/layout.tsx` e i colori avatar).
- Icone da `lucide-react`, date con `date-fns`.
- Mobile-first: verifica sempre il layout sotto i 1024px.
- Per domande di orientamento sul codice ("dove sta X", "come funziona Y") usa il subagent `codebase-explorer` (`.claude/agents/codebase-explorer.md`): è di sola lettura, non usarlo per fare modifiche.
