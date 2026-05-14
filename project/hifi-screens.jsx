// ─────────────────────────────────────────────────────────────
// AirportParty — Hi-fi screens (00, 01, 02) × 3 directions
// ─────────────────────────────────────────────────────────────

// ═══ SCREEN 00 — Da quale aeroporto parti? ═══

function HF_S00({ theme: t }) {
  const chips = ['MXP', 'FCO', 'LIN', 'BGY', 'BLQ', 'NAP'];
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <HFWordmark size={22} theme={t} />
          <HFBtn small theme={t}>accedi</HFBtn>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 6 }}>
          <h1 style={{
            fontFamily: t.font, fontSize: 34, fontWeight: 800, lineHeight: 1.05,
            margin: 0, letterSpacing: -0.8, color: t.ink,
          }}>
            non aspettare<br /><span style={{ color: t.primary }}>da solo</span>.
          </h1>
        </div>
        <p style={{
          fontFamily: t.font, fontSize: 15, color: t.inkSoft, lineHeight: 1.5,
          margin: '0 0 28px', fontWeight: 500,
        }}>
          Trova chi parte vicino a te.<br />Un caffè, una birra, due chiacchiere.
        </p>

        {/* Search field */}
        <div style={{
          border: `1.5px solid ${t.border}`, borderRadius: t.radius, padding: '16px 18px',
          background: t.card, display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: t.shadowLg, marginBottom: 18,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.inkMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2 }}>
              da quale aeroporto parti?
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, color: t.inkMuted, marginTop: 2 }}>
              Cerca città o codice…
            </div>
          </div>
        </div>

        {/* Quick chips */}
        <div style={{ fontSize: 11, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 4 }}>
          o scegli al volo
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {chips.map(c => <HFTag key={c} theme={t}>{c}</HFTag>)}
        </div>

        <div style={{ flex: 1 }} />

        {/* Footer hint */}
        <p style={{
          fontFamily: t.font, fontSize: 12, color: t.inkMuted, textAlign: 'center',
          fontWeight: 500, margin: 0,
        }}>
          Scegli l'aeroporto → ti mostriamo chi c'è oggi ✈
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ SCREEN 01 — Timeline oggi ═══

function HFSlotNode({ time, going, highlight = false, theme: t }) {
  return (
    <div style={{ position: 'relative', marginBottom: 14 }}>
      {/* Node dot */}
      <div style={{
        position: 'absolute', left: -30, top: 16,
        width: 16, height: 16, borderRadius: '50%',
        background: highlight ? t.primary : t.card,
        border: `2px solid ${highlight ? t.primary : t.border}`,
        boxShadow: highlight ? `0 0 0 4px ${t.primarySoft}` : 'none',
      }} />
      {/* Card */}
      <div style={{
        border: `1.5px solid ${highlight ? t.primary : t.border}`,
        borderRadius: t.radius, padding: '12px 14px',
        background: highlight ? t.primarySoft : t.card,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: t.shadow,
      }}>
        <div>
          <div style={{ fontFamily: t.fontMono, fontSize: 18, fontWeight: 700, color: t.ink, lineHeight: 1 }}>{time}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <HFAvatarStack count={going} total={going} size={22} theme={t} />
            <span style={{ fontSize: 12, fontWeight: 600, color: t.inkSoft }}>{going} {going === 1 ? 'persona' : 'persone'}</span>
          </div>
        </div>
        <HFBtn small primary={highlight} theme={t}>
          {highlight ? '✓ joined' : 'join'}
        </HFBtn>
      </div>
    </div>
  );
}

function HF_S01({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <HFTag filled theme={t}>MXP</HFTag>
        </div>

        {/* Date/time bar */}
        <div style={{
          border: `1.5px solid ${t.border}`, borderRadius: t.radiusSm, padding: '10px 14px',
          background: t.card, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: t.shadow,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>data</div>
            <span style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 700 }}>oggi · 06 mag</span>
          </div>
          <div style={{ borderLeft: `1px solid ${t.border}`, paddingLeft: 14, marginLeft: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>ora</div>
            <span style={{ fontFamily: t.fontMono, fontSize: 14, fontWeight: 700 }}>tutto il giorno</span>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: t.font, fontSize: 22, fontWeight: 800, margin: '0 0 2px',
          letterSpacing: -0.5, lineHeight: 1.15, color: t.ink,
        }}>
          chi c'è <span style={{ color: t.primary }}>oggi</span><br />a Malpensa?
        </h2>
        <p style={{ fontFamily: t.font, fontSize: 13, color: t.inkSoft, margin: '0 0 16px', fontWeight: 500 }}>
          Scegli con chi aspettare
        </p>

        {/* Timeline track */}
        <div style={{ position: 'relative', paddingLeft: 38 }}>
          <svg width="3" height="360" style={{ position: 'absolute', left: 16, top: 8 }}>
            <line x1="1.5" y1="0" x2="1.5" y2="360" stroke={t.border} strokeWidth="2" strokeDasharray="5 5" />
          </svg>
          <HFSlotNode time="13:00" going={2} theme={t} />
          <HFSlotNode time="13:30" going={5} highlight theme={t} />
          <HFSlotNode time="14:00" going={3} theme={t} />
          <HFSlotNode time="14:30" going={7} theme={t} />
        </div>
      </div>
    </HFPhone>
  );
}

// ═══ SCREEN 02 — Dettaglio slot ═══

function HF_S02({ theme: t }) {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', note: 'caffè pre-volo?', color: '#FFD5B8' },
    { init: 'L', name: 'Laura', dest: 'AMS', note: 'arrivo presto', color: '#C9E4FF' },
    { init: 'A', name: 'Alessandro', dest: 'LHR', note: 'birra!', color: '#FFE2EC' },
    { init: 'S', name: 'Sara', dest: 'CDG', note: '', color: '#D8F5C7' },
    { init: 'G', name: 'Giulia', dest: 'BER', note: 'prima volta', color: '#E8D5FF' },
  ];

  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <HFWordmark size={18} theme={t} />
        </div>

        {/* Slot header card */}
        <div style={{
          borderRadius: t.radius, padding: 16, background: t.primarySoft,
          marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div>
              <div style={{ fontFamily: t.fontMono, fontSize: 28, fontWeight: 700, color: t.ink, lineHeight: 1 }}>13:30</div>
              <p style={{ fontSize: 12, color: t.inkSoft, margin: '4px 0 0', fontWeight: 500 }}>slot di mezz'ora</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <HFTag filled theme={t}>MXP</HFTag>
              <p style={{ fontSize: 11, color: t.inkSoft, margin: '4px 0 0', fontWeight: 500 }}>oggi · 06 mag</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <HFAvatarStack count={5} total={5} size={26} theme={t} />
            <span style={{ fontSize: 13, fontWeight: 700, color: t.ink }}>5 persone</span>
          </div>
        </div>

        {/* Info row */}
        <div style={{
          borderRadius: t.radiusSm, padding: '12px 14px',
          background: t.card, border: `1.5px solid ${t.border}`,
          marginBottom: 14, display: 'flex', gap: 14,
          boxShadow: t.shadow,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>punto ritrovo</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.ink, marginTop: 2 }}>Bar Terminal 1</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 1 }}>vicino gate B · landside</div>
          </div>
          <div style={{ borderLeft: `1px solid ${t.border}`, paddingLeft: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1 }}>durata</div>
            <div style={{ fontFamily: t.fontMono, fontSize: 15, fontWeight: 700, color: t.ink, marginTop: 2 }}>30 min</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 1 }}>13:30 → 14:00</div>
          </div>
        </div>

        {/* People list */}
        <h3 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.3 }}>chi c'è</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${t.border}`, borderRadius: t.radiusSm,
              padding: '8px 12px', background: t.card,
            }}>
              <HFAvatar init={p.init} color={p.color} size={32} theme={t} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>
                  → {p.dest}{p.note ? ` · ${p.note}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <HFBtn primary full theme={t}>
          join · entra nel gruppo ✈
        </HFBtn>
        <p style={{
          fontSize: 11, color: t.inkMuted, textAlign: 'center',
          margin: '8px 0 0', fontWeight: 500,
        }}>
          La chat si aprirà 3h prima del meetup
        </p>
      </div>
    </HFPhone>
  );
}

// Expose
Object.assign(window, { HF_S00, HF_S01, HF_S02, HFSlotNode });
