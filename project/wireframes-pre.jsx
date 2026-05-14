// AirportParty — Schermata 0 (pre-selezione)
// Cosa vede l'utente PRIMA di scegliere aeroporto + giorno + orario.
// 3 varianti per esplorare il momento "vuoto" iniziale.

const P0_W = 360;
const P0_H = 720;
const ink0 = '#1a1a1a';
const inkSoft0 = '#2a2a2a';
const paper0 = '#fafaf5';
const accent0 = 'var(--ap-accent, #ff3d7f)';
const accentSoft0 = 'var(--ap-accent-soft, #ffe0ec)';
const fH0 = "'Caveat', cursive";
const fB0 = "'Architects Daughter', cursive";
const fM0 = "'JetBrains Mono', monospace";

function Phone0({ children, bg = paper0 }) {
  return (
    <div style={{
      position: 'relative', width: P0_W, height: P0_H, background: bg,
      border: `2px solid ${ink0}`, borderRadius: 28, overflow: 'hidden',
      filter: 'url(#wobble)', boxShadow: '4px 4px 0 rgba(0,0,0,0.08)',
    }}>
      <div style={{
        position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        width: 90, height: 18, background: ink0, borderRadius: 12, zIndex: 5,
      }} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 36 }}>{children}</div>
    </div>
  );
}

// Empty input field — placeholder visibile
function EmptyField({ label, placeholder, icon, big = false }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        fontFamily: fB0, fontSize: 10, color: inkSoft0,
        textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, marginLeft: 4,
      }}>{label}</div>
      <div style={{
        border: `2px ${big ? 'solid' : 'dashed'} ${ink0}`, borderRadius: 14,
        padding: big ? '16px 16px' : '14px 14px',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 12,
        fontFamily: fB0, fontSize: big ? 16 : 14, color: 'rgba(0,0,0,0.4)',
      }}>
        <span style={{ fontSize: big ? 22 : 18 }}>{icon}</span>
        <span>{placeholder}</span>
        <span style={{ marginLeft: 'auto', fontFamily: fH0, fontSize: 18, color: ink0 }}>+</span>
      </div>
    </div>
  );
}

// ─── A · Empty state pulito ─────────────────────────────────
// Header con saluto · 3 campi vuoti · CTA disabilitata · spiegazione "come funziona"
function P0_Empty() {
  return (
    <Phone0>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 22px', height: 18, marginTop: -28, marginBottom: 10,
        fontFamily: fM0, fontSize: 11, color: ink0, position: 'relative', zIndex: 6,
      }}>
        <span>9:41</span><span style={{ letterSpacing: 2 }}>••• ◐ ▮</span>
      </div>
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Wordmark />
          <div style={{
            width: 28, height: 28, border: `2px solid ${ink0}`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fH0, fontSize: 16,
          }}>M</div>
        </div>

        <H size={28} style={{ marginBottom: 4 }}>Ciao Marco!<br/>Pronto a partire?</H>
        <P style={{ marginBottom: 18 }}>
          dimmi <i>da dove</i> e <i>quando</i><br/>
          ti trovo compagnia ✦
        </P>

        <EmptyField label="Aeroporto" placeholder="cerca città o codice" icon="🛫" big />
        <EmptyField label="Giorno" placeholder="quando parti?" icon="📅" />
        <EmptyField label="Orario partenza" placeholder="es. 15:30" icon="🕒" />

        <div style={{ marginTop: 14, opacity: 0.45 }}>
          <SketchBtn full primary>trova il mio gruppo →</SketchBtn>
        </div>

        <div style={{
          marginTop: 22, paddingTop: 14, borderTop: `1.5px dashed ${ink0}`,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{
            fontFamily: fH0, fontSize: 28, color: accent0, lineHeight: 1, flexShrink: 0,
          }}>?</div>
          <div>
            <div style={{ fontFamily: fH0, fontSize: 18, fontWeight: 700 }}>come funziona</div>
            <P size={11}>
              ti mostriamo gruppi di viaggiatori che si trovano in aeroporto<br/>
              <b>30 min prima</b> della tua partenza
            </P>
          </div>
        </div>
      </div>
    </Phone0>
  );
}

// ─── B · Hero "perché" — più narrativo ──────────────────────
// Grande illustrazione/scribble · slogan · CTA singola "iniziamo"
function P0_Hero() {
  return (
    <Phone0 bg="#f5f0e6">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 22px', height: 18, marginTop: -28, marginBottom: 8,
        fontFamily: fM0, fontSize: 11, color: ink0, position: 'relative', zIndex: 6,
      }}>
        <span>9:41</span><span style={{ letterSpacing: 2 }}>••• ◐ ▮</span>
      </div>
      <div style={{ padding: '0 22px 22px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Wordmark />
          <P size={11}>accedi</P>
        </div>

        {/* Hero scribble */}
        <div style={{
          marginTop: 6, marginBottom: 14, position: 'relative',
          height: 200, border: `2px solid ${ink0}`, borderRadius: 18,
          background: '#fff', overflow: 'hidden',
          transform: 'rotate(-0.6deg)',
        }}>
          <svg viewBox="0 0 320 200" width="100%" height="100%">
            {/* terra/orizzonte */}
            <path d="M 0 160 Q 80 145, 160 160 T 320 160 L 320 200 L 0 200 Z" fill={accentSoft0} />
            {/* aereo */}
            <g transform="translate(180 70) rotate(-12)">
              <path d="M -28 0 L 28 0 L 22 -8 L 6 -8 L -2 -16 L -8 -16 L -4 -8 L -22 -8 Z"
                    fill="#fff" stroke={ink0} strokeWidth="2" strokeLinejoin="round" />
            </g>
            {/* scia tratteggiata */}
            <path d="M 50 130 Q 110 100, 160 80" fill="none" stroke={ink0} strokeWidth="2" strokeDasharray="3 5" />
            {/* persone (3 cerchietti che si incontrano) */}
            <g transform="translate(70 165)">
              <circle cx="0" cy="0" r="14" fill="#ffd5b8" stroke={ink0} strokeWidth="2"/>
              <circle cx="22" cy="-4" r="14" fill="#c9e4ff" stroke={ink0} strokeWidth="2"/>
              <circle cx="44" cy="0" r="14" fill="#d8f5c7" stroke={ink0} strokeWidth="2"/>
              <text x="0" y="4" fontFamily="Caveat" fontSize="14" textAnchor="middle" fontWeight="700">L</text>
              <text x="22" y="0" fontFamily="Caveat" fontSize="14" textAnchor="middle" fontWeight="700">A</text>
              <text x="44" y="4" fontFamily="Caveat" fontSize="14" textAnchor="middle" fontWeight="700">G</text>
            </g>
            {/* sole */}
            <circle cx="270" cy="40" r="14" fill="none" stroke={ink0} strokeWidth="2"/>
          </svg>
        </div>

        <H size={32} style={{ marginBottom: 6, lineHeight: 1 }}>
          il gate non<br/>è il finale.
        </H>
        <P size={14} style={{ marginBottom: 22 }}>
          è dove conosci qualcuno.<br/>
          unisciti al gruppo del tuo volo ✈
        </P>

        <SketchBtn full primary>iniziamo →</SketchBtn>

        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 14 }}>
          <P size={11}>✦ 12k iscritti</P>
          <P size={11}>✦ 80 aeroporti</P>
        </div>
      </div>
    </Phone0>
  );
}

// ─── C · Quick-start — un solo step grande ─────────────────
// Tutto si concentra sul primo gesto: cercare l'aeroporto.
// Giorno/orario arrivano DOPO, in step successivi.
function P0_QuickStart() {
  return (
    <Phone0>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 22px', height: 18, marginTop: -28, marginBottom: 10,
        fontFamily: fM0, fontSize: 11, color: ink0, position: 'relative', zIndex: 6,
      }}>
        <span>9:41</span><span style={{ letterSpacing: 2 }}>••• ◐ ▮</span>
      </div>
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Wordmark />
          <Tag>step 1 di 3</Tag>
        </div>

        {/* step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: `2px solid ${ink0}`,
            background: accent0, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fH0, fontSize: 16, fontWeight: 700 }}>1</div>
          <div style={{ flex: 1, height: 2, borderTop: `2px dashed ${ink0}` }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${ink0}`,
            color: inkSoft0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fH0, fontSize: 13 }}>2</div>
          <div style={{ flex: 1, height: 2, borderTop: `2px dashed ${ink0}` }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${ink0}`,
            color: inkSoft0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fH0, fontSize: 13 }}>3</div>
        </div>

        <H size={28} style={{ marginBottom: 4 }}>Da quale<br/>aeroporto parti?</H>
        <P style={{ marginBottom: 18 }}>cerca per città o codice IATA</P>

        {/* search vuota grande */}
        <div style={{
          border: `2px solid ${ink0}`, borderRadius: 18, padding: '16px 16px',
          background: '#fff', display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 22 }}>🔍</span>
          <span style={{ fontFamily: fB0, fontSize: 16, color: 'rgba(0,0,0,0.35)' }}>
            es. Milano, MXP, Roma…
          </span>
        </div>

        {/* GPS shortcut */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 14px', border: `2px dashed ${ink0}`, borderRadius: 999,
          marginBottom: 22, fontFamily: fB0, fontSize: 12,
          background: 'transparent',
        }}>
          📍 usa la mia posizione
        </div>

        {/* suggested airports */}
        <div style={{
          fontFamily: fB0, fontSize: 10, color: inkSoft0,
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginLeft: 2,
        }}>più popolari</div>
        {[
          { code: 'MXP', name: 'Milano Malpensa', live: 142 },
          { code: 'FCO', name: 'Roma Fiumicino', live: 98 },
          { code: 'BGY', name: 'Milano Bergamo', live: 54 },
        ].map((a, i) => (
          <div key={a.code} style={{
            border: `2px solid ${ink0}`, borderRadius: 12, padding: '10px 12px',
            background: '#fff', display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 8, transform: `rotate(${i % 2 ? 0.3 : -0.2}deg)`,
          }}>
            <div style={{
              width: 44, padding: '4px 0', textAlign: 'center',
              border: `1.5px solid ${ink0}`, borderRadius: 8,
              fontFamily: fM0, fontSize: 13, fontWeight: 700,
            }}>{a.code}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: fB0, fontSize: 13, color: ink0 }}>{a.name}</div>
              <div style={{ fontFamily: fB0, fontSize: 10, color: inkSoft0 }}>
                ✦ {a.live} viaggiatori adesso
              </div>
            </div>
            <span style={{ fontFamily: fH0, fontSize: 22 }}>→</span>
          </div>
        ))}
      </div>
    </Phone0>
  );
}

Object.assign(window, { P0_Empty, P0_Hero, P0_QuickStart });
