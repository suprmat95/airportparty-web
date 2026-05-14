// AirportParty — 4 low-fi wireframe directions, mobile web
// Each wireframe is a 360x720 phone-shaped frame, sketchy + handwritten

const PHONE_W = 360;
const PHONE_H = 720;

// ─────────────────────────────────────────────────────────────
// Sketch primitives — wobbly borders, dashed lines, scribbles
// ─────────────────────────────────────────────────────────────
const ink = '#1a1a1a';
const inkSoft = '#2a2a2a';
const paper = '#fafaf5';
const paperWarm = '#f5f0e6';
const accent = 'var(--ap-accent, #ff3d7f)';
const accentSoft = 'var(--ap-accent-soft, #ffe0ec)';

const fontHand = "'Caveat', 'Bradley Hand', cursive";
const fontBody = "'Architects Daughter', 'Comic Sans MS', cursive";
const fontMono = "'JetBrains Mono', 'Courier New', monospace";

// Rough rectangle border using SVG filter — gives that hand-drawn jitter
const wobble = { filter: 'url(#wobble)' };

function SketchDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        <filter id="wobble">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.6" />
        </filter>
        <filter id="wobbleStrong">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="2.6" />
        </filter>
        <pattern id="paperGrid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
        </pattern>
      </defs>
    </svg>
  );
}

// Phone shell — rounded rectangle, paper background
function Phone({ children, bg = paper, label }) {
  return (
    <div style={{
      position: 'relative',
      width: PHONE_W,
      height: PHONE_H,
      background: bg,
      border: `2px solid ${ink}`,
      borderRadius: 28,
      overflow: 'hidden',
      filter: 'url(#wobble)',
      boxShadow: '4px 4px 0 rgba(0,0,0,0.08)',
    }}>
      {/* notch */}
      <div style={{
        position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
        width: 90, height: 18, background: ink, borderRadius: 12, zIndex: 5,
      }} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 36 }}>
        {children}
      </div>
    </div>
  );
}

// Status row — fake time + signal scribble
function StatusBar({ dark = false }) {
  const c = dark ? '#fff' : ink;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 22px 0 26px', height: 18, marginTop: -28, marginBottom: 10,
      fontFamily: fontMono, fontSize: 11, color: c, position: 'relative', zIndex: 6,
    }}>
      <span>9:41</span>
      <span style={{ letterSpacing: 2 }}>••• ◐ ▮</span>
    </div>
  );
}

// Logo / wordmark
function Wordmark({ size = 22, color = ink }) {
  return (
    <span style={{
      fontFamily: fontHand, fontSize: size, color, fontWeight: 700, letterSpacing: -0.5,
      lineHeight: 1,
    }}>
      airport<span style={{ color: accent }}>party</span>
      <span style={{ display: 'inline-block', marginLeft: 4, transform: 'translateY(-2px) rotate(20deg)' }}>✈</span>
    </span>
  );
}

// Sketchy button
function SketchBtn({ children, primary = false, full = false, small = false, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      padding: small ? '6px 14px' : '12px 22px',
      background: primary ? accent : 'transparent',
      color: primary ? '#fff' : ink,
      border: `2px solid ${ink}`,
      borderRadius: 999,
      fontFamily: fontBody,
      fontSize: small ? 12 : 14,
      fontWeight: 700,
      width: full ? '100%' : 'auto',
      cursor: 'pointer',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Sketchy field
function SketchField({ label, value, placeholder, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <div style={{
          fontFamily: fontBody, fontSize: 11, color: inkSoft,
          textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginLeft: 4,
        }}>{label}</div>
      )}
      <div style={{
        border: `2px solid ${ink}`, borderRadius: 14, padding: '12px 14px',
        background: '#fff', display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: fontBody, fontSize: 15,
        color: value ? ink : 'rgba(0,0,0,0.4)',
      }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span>{value || placeholder}</span>
      </div>
    </div>
  );
}

// Avatar group — circles with initials
function AvatarStack({ count = 4, total = null, size = 24 }) {
  const colors = ['#ffd5b8', '#c9e4ff', '#ffe2ec', '#d8f5c7', '#e8d5ff', '#fff3b8'];
  const initials = ['M', 'L', 'A', 'S', 'G', 'T'];
  const shown = Math.min(count, 4);
  const rest = (total ?? count) - shown;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {Array.from({ length: shown }).map((_, i) => (
        <div key={i} style={{
          width: size, height: size, borderRadius: '50%', background: colors[i % colors.length],
          border: `1.5px solid ${ink}`, marginLeft: i === 0 ? 0 : -6,
          fontFamily: fontHand, fontSize: size * 0.55, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: ink, position: 'relative', zIndex: shown - i,
        }}>{initials[i % initials.length]}</div>
      ))}
      {rest > 0 && (
        <div style={{
          width: size, height: size, borderRadius: '50%', background: paperWarm,
          border: `1.5px solid ${ink}`, marginLeft: -6,
          fontFamily: fontMono, fontSize: size * 0.4, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: ink,
        }}>+{rest}</div>
      )}
    </div>
  );
}

// Squiggle separator
function Squiggle({ color = ink, w = 60 }) {
  return (
    <svg width={w} height="8" viewBox={`0 0 ${w} 8`} style={{ display: 'block' }}>
      <path d={`M 0 4 Q ${w/8} 0, ${w/4} 4 T ${w/2} 4 T ${w*3/4} 4 T ${w} 4`}
        fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Section heading (handwritten)
function H({ children, size = 26, style = {} }) {
  return (
    <h2 style={{
      fontFamily: fontHand, fontSize: size, fontWeight: 700, color: ink,
      margin: 0, lineHeight: 1.05, letterSpacing: -0.5, ...style,
    }}>{children}</h2>
  );
}

// Caption (architects-daughter)
function P({ children, size = 12, color = inkSoft, style = {} }) {
  return (
    <div style={{ fontFamily: fontBody, fontSize: size, color, lineHeight: 1.45, ...style }}>
      {children}
    </div>
  );
}

// Scribbled tag
function Tag({ children, filled = false }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px',
      border: `1.5px solid ${ink}`, borderRadius: 999,
      background: filled ? accentSoft : 'transparent',
      fontFamily: fontMono, fontSize: 10, color: ink, letterSpacing: 0.5,
    }}>{children}</span>
  );
}

// ─────────────────────────────────────────────────────────────
// Slot row — the core component (chosen list-style)
// 14:00 · N going · avatars · join button
// ─────────────────────────────────────────────────────────────
function SlotRow({ time, going, joined = false, density = 'rich', highlight = false }) {
  return (
    <div style={{
      border: `2px solid ${ink}`,
      borderRadius: 14,
      padding: density === 'minimal' ? '10px 12px' : '12px 14px',
      background: highlight ? accentSoft : '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 10,
      transform: highlight ? 'rotate(-0.4deg)' : 'rotate(0.2deg)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div>
          <div style={{ fontFamily: fontMono, fontSize: 17, fontWeight: 700, color: ink, lineHeight: 1 }}>
            {time}
          </div>
          {density !== 'minimal' && (
            <div style={{ fontFamily: fontBody, fontSize: 10, color: inkSoft, marginTop: 3 }}>
              {going} {going === 1 ? 'persona' : 'persone'}
            </div>
          )}
        </div>
        {density === 'rich' && going > 0 && <AvatarStack count={going} total={going} size={22} />}
      </div>
      <SketchBtn small primary={joined}>
        {joined ? '✓ joined' : '+ join'}
      </SketchBtn>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// WIREFRAME 1 — Stepped wizard, scrolling page, classic flow
// All on one page: airport · time · slots
// ─────────────────────────────────────────────────────────────
function W1_Classic({ density = 'rich' }) {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Wordmark />
          <div style={{
            width: 28, height: 28, border: `2px solid ${ink}`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 16,
          }}>M</div>
        </div>

        <H size={30} style={{ marginBottom: 4 }}>Ciao!<br/>Da dove parti?</H>
        <P style={{ marginBottom: 16 }}>Trova compagnia prima del volo ✈</P>

        <SketchField
          label="Aeroporto"
          value="Milano Malpensa · MXP"
          icon="🛫"
        />
        <SketchField
          label="Partenza"
          value="oggi · 15:30"
          icon="🕒"
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '18px 0 10px' }}>
          <Squiggle w={40} />
          <H size={20}>slot disponibili</H>
          <Squiggle w={40} />
        </div>
        <P size={11} style={{ marginBottom: 12 }}>
          Mezz'ora prima della partenza →
        </P>

        <SlotRow time="13:00" going={2} density={density} />
        <SlotRow time="13:30" going={5} density={density} highlight />
        <SlotRow time="14:00" going={3} density={density} />
        <SlotRow time="14:30" going={7} density={density} />
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// WIREFRAME 2 — Boarding-pass metaphor
// Top half = boarding pass with airport + time
// Bottom = perforated tear, then slots as ticket stubs
// ─────────────────────────────────────────────────────────────
function W2_BoardingPass({ density = 'rich' }) {
  return (
    <Phone bg={paperWarm}>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: fontHand, fontSize: 20, color: ink, cursor: 'pointer' }}>←</span>
            <Wordmark size={20} />
          </div>
          <P size={11}>boarding pass</P>
        </div>

        {/* Boarding pass card */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, background: '#fff',
          padding: 14, position: 'relative', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>from</P>
              <div style={{ fontFamily: fontMono, fontSize: 38, fontWeight: 700, lineHeight: 1, color: ink }}>MXP</div>
              <P size={11}>Milano Malpensa</P>
            </div>
          </div>

          <Squiggle w={300} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <P size={9} style={{ textTransform: 'uppercase' }}>departure</P>
              <div style={{ fontFamily: fontMono, fontSize: 18, fontWeight: 700, color: ink }}>15:30</div>
            </div>
            <div>
              <P size={9} style={{ textTransform: 'uppercase' }}>date</P>
              <div style={{ fontFamily: fontMono, fontSize: 18, fontWeight: 700, color: ink }}>04 MAY</div>
            </div>
            <div>
              <P size={9} style={{ textTransform: 'uppercase' }}>passenger</P>
              <div style={{ fontFamily: fontHand, fontSize: 20, fontWeight: 700, color: ink }}>Marco</div>
            </div>
          </div>

          {/* Perforation circles */}
          <div style={{
            position: 'absolute', left: -8, bottom: 36, width: 16, height: 16,
            borderRadius: '50%', background: paperWarm, border: `2px solid ${ink}`,
          }} />
          <div style={{
            position: 'absolute', right: -8, bottom: 36, width: 16, height: 16,
            borderRadius: '50%', background: paperWarm, border: `2px solid ${ink}`,
          }} />
        </div>

        <H size={20} style={{ textAlign: 'center', marginBottom: 4 }}>
          ↓ chi incontri prima del volo? ↓
        </H>
        <P size={11} style={{ textAlign: 'center', marginBottom: 12 }}>
          slot da 30 min · scegline uno
        </P>

        <SlotRow time="13:30" going={5} density={density} highlight />
        <SlotRow time="14:00" going={3} density={density} />
        <SlotRow time="14:30" going={7} density={density} />
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// WIREFRAME 3 — Search-first, dense + practical
// Big search bar at top, time chip, slots fill the screen
// ─────────────────────────────────────────────────────────────
function W3_SearchFirst({ density = 'rich' }) {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Wordmark size={20} />
          <P size={11}>🔔 2</P>
        </div>

        {/* Big search field */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, padding: '12px 14px',
          background: '#fff', display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 10,
        }}>
          <span style={{ fontFamily: fontHand, fontSize: 18 }}>🔍</span>
          <div style={{ flex: 1 }}>
            <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>aeroporto</P>
            <div style={{ fontFamily: fontMono, fontSize: 15, fontWeight: 700, color: ink }}>
              MXP <span style={{ fontFamily: fontBody, fontWeight: 400, color: inkSoft, fontSize: 13 }}>· Malpensa</span>
            </div>
          </div>
        </div>

        {/* Time chips */}
        <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginLeft: 4 }}>
          la mia partenza
        </P>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <Tag>oggi</Tag>
          <Tag>14:00</Tag>
          <Tag>14:30</Tag>
          <Tag filled>15:30 ✓</Tag>
          <Tag>16:00</Tag>
          <Tag>+</Tag>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <H size={22}>incontri pre-volo</H>
          <P size={11}>ordina ↓</P>
        </div>
        <P size={11} style={{ marginBottom: 10 }}>
          <span style={{ background: accentSoft, padding: '1px 6px', borderRadius: 4 }}>
            mezz'ora prima della tua partenza
          </span>
        </P>

        <SlotRow time="13:00" going={2} density={density} />
        <SlotRow time="13:30" going={5} density={density} highlight />
        <SlotRow time="14:00" going={3} density={density} />
        <SlotRow time="14:30" going={7} density={density} />
        <SlotRow time="15:00" going={1} density={density} />
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// WIREFRAME 4 — Timeline / vertical track, playful
// A vertical line representing time before departure
// Each slot is a "stop" with people gathering
// ─────────────────────────────────────────────────────────────
function W4_Timeline({ density = 'rich' }) {
  const slots = [
    { time: '13:00', going: 2 },
    { time: '13:30', going: 5, highlight: true },
    { time: '14:00', going: 3 },
    { time: '14:30', going: 7 },
  ];
  return (
    <Phone bg={paper}>
      <StatusBar />
      <div style={{ padding: '0 18px 16px', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Wordmark size={20} />
          <Tag filled>MXP · 15:30</Tag>
        </div>

        <H size={26} style={{ marginBottom: 2 }}>la tua corsa<br/>al gate</H>
        <P style={{ marginBottom: 14 }}>scegli con chi aspettare ✦</P>

        {/* Track */}
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          {/* dashed vertical line */}
          <svg width="3" height="380" style={{ position: 'absolute', left: 14, top: 8 }}>
            <line x1="1.5" y1="0" x2="1.5" y2="380" stroke={ink} strokeWidth="2" strokeDasharray="4 5" />
          </svg>

          {slots.map((s, i) => (
            <div key={s.time} style={{ position: 'relative', marginBottom: 12 }}>
              {/* node */}
              <div style={{
                position: 'absolute', left: -28, top: 14,
                width: 18, height: 18, borderRadius: '50%',
                background: s.highlight ? accent : '#fff',
                border: `2px solid ${ink}`,
              }} />
              <div style={{
                border: `2px solid ${ink}`, borderRadius: 14, background: s.highlight ? accentSoft : '#fff',
                padding: '10px 12px', transform: `rotate(${i % 2 ? 0.4 : -0.3}deg)`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: fontMono, fontSize: 16, fontWeight: 700, color: ink, lineHeight: 1 }}>{s.time}</div>
                  {density !== 'minimal' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <AvatarStack count={s.going} total={s.going} size={20} />
                      <P size={10}>{s.going} qui</P>
                    </div>
                  )}
                </div>
                <SketchBtn small primary={s.highlight}>
                  {s.highlight ? '✓ joined' : 'join'}
                </SketchBtn>
              </div>
            </div>
          ))}

          {/* gate marker at end */}
          <div style={{ position: 'relative', marginTop: 6 }}>
            <div style={{
              position: 'absolute', left: -34, top: 6,
              width: 30, height: 30, borderRadius: '50%',
              background: ink, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: fontHand, fontSize: 18,
            }}>✈</div>
            <div style={{
              border: `2px dashed ${ink}`, borderRadius: 12, padding: '8px 12px',
              background: 'transparent',
            }}>
              <div style={{ fontFamily: fontHand, fontSize: 18, fontWeight: 700 }}>il tuo volo · 15:30</div>
              <P size={10}>gate B14</P>
            </div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// W0 — STATO INIZIALE / EMPTY HOME
// La prima volta: nessun aeroporto, nessun orario.
// Hero + due grandi CTA da riempire + suggerimenti rapidi
// ─────────────────────────────────────────────────────────────
function W0_Empty() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Wordmark />
          <SketchBtn small style={{ padding: '4px 12px' }}>entra</SketchBtn>
        </div>

        {/* Hero scribble */}
        <div style={{ marginBottom: 8 }}>
          <H size={36} style={{ lineHeight: 1 }}>
            non aspettare<br/>
            <span style={{ color: accent }}>da solo</span>.
          </H>
        </div>
        <P size={13} style={{ marginBottom: 20 }}>
          trova chi parte vicino a te.<br/>
          un caffè, una birra, due chiacchiere ✦
        </P>

        {/* Empty CTA card — airport */}
        <div style={{
          border: `2px dashed ${ink}`, borderRadius: 16, padding: 14, background: '#fff',
          marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12,
          transform: 'rotate(-0.3deg)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, border: `2px solid ${ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 22, background: paperWarm,
          }}>🛫</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fontBody, fontSize: 10, color: inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              da quale aeroporto?
            </div>
            <div style={{ fontFamily: fontHand, fontSize: 22, color: 'rgba(0,0,0,0.4)', lineHeight: 1.1 }}>
              cerca città o codice…
            </div>
          </div>
          <span style={{ fontFamily: fontHand, fontSize: 22, color: ink }}>+</span>
        </div>

        {/* Empty CTA card — when */}
        <div style={{
          border: `2px dashed ${ink}`, borderRadius: 16, padding: 14, background: '#fff',
          marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12,
          transform: 'rotate(0.3deg)',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, border: `2px solid ${ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 22, background: paperWarm,
          }}>🕒</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fontBody, fontSize: 10, color: inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              quando parti?
            </div>
            <div style={{ fontFamily: fontHand, fontSize: 22, color: 'rgba(0,0,0,0.4)', lineHeight: 1.1 }}>
              giorno · orario…
            </div>
          </div>
          <span style={{ fontFamily: fontHand, fontSize: 22, color: ink }}>+</span>
        </div>

        {/* Quick chips — popular airports */}
        <P size={11} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
          o parti veloce da
        </P>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
          <Tag>MXP</Tag><Tag>FCO</Tag><Tag>LIN</Tag><Tag>BGY</Tag><Tag>BLQ</Tag><Tag>NAP</Tag>
        </div>

        {/* Hint at the result */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 14, padding: 12, background: accentSoft,
          transform: 'rotate(-0.5deg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Squiggle w={28} />
            <P size={11} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>come funziona</P>
            <Squiggle w={28} />
          </div>
          <P size={12}>
            scegli aeroporto + orario →<br/>
            ti mostriamo gli slot da 30' prima del volo →<br/>
            entra in uno e incontri chi è lì come te ✈
          </P>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// W0b — STATO ZERO: solo "da quale aeroporto parti?"
// ─────────────────────────────────────────────────────────────
function W0_NoAirport() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <Wordmark />
          <SketchBtn small style={{ padding: '4px 12px' }}>accedi / registrati →</SketchBtn>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 8 }}>
          <H size={36} style={{ lineHeight: 1 }}>
            non aspettare<br/>
            <span style={{ color: accent }}>da solo</span>.
          </H>
        </div>
        <P size={13} style={{ marginBottom: 28 }}>
          trova chi parte vicino a te.<br/>
          un caffè, una birra, due chiacchiere ✦
        </P>

        {/* Unica domanda: aeroporto */}
        <div style={{
          border: `2px dashed ${ink}`, borderRadius: 16, padding: 16, background: '#fff',
          marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12,
          transform: 'rotate(-0.3deg)',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, border: `2px solid ${ink}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 24, background: paperWarm,
          }}>🛫</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fontBody, fontSize: 11, color: inkSoft, textTransform: 'uppercase', letterSpacing: 1 }}>
              da quale aeroporto parti?
            </div>
            <div style={{ fontFamily: fontHand, fontSize: 22, color: 'rgba(0,0,0,0.35)', lineHeight: 1.1 }}>
              cerca città o codice…
            </div>
          </div>
        </div>

        {/* Quick chips */}
        <P size={11} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginLeft: 4 }}>
          o scegli al volo
        </P>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          <Tag>MXP</Tag><Tag>FCO</Tag><Tag>LIN</Tag><Tag>BGY</Tag><Tag>BLQ</Tag><Tag>NAP</Tag>
        </div>

        <div style={{ flex: 1 }} />

        {/* Mini hint in fondo */}
        <P size={11} color="rgba(0,0,0,0.35)" style={{ textAlign: 'center' }}>
          scegli l'aeroporto → ti mostriamo chi c'è oggi ✈
        </P>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 1A — Slot list con filtro data inline (chip "oggi" default)
// L'utente vede subito gli slot di oggi. Può cambiare giorno/ora
// con chip in alto.
// ─────────────────────────────────────────────────────────────
function P1_SlotChips({ density = 'rich' }) {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag filled>MXP</Tag>
        </div>

        {/* Date chips — "oggi" è selezionato */}
        <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, marginLeft: 4 }}>
          quando?
        </P>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
          <Tag filled>oggi ✓</Tag>
          <Tag>domani</Tag>
          <Tag>altro giorno…</Tag>
        </div>

        {/* Time chips */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <Tag>mattina</Tag>
          <Tag filled>pomeriggio ✓</Tag>
          <Tag>sera</Tag>
          <Tag>orario esatto…</Tag>
        </div>

        <Squiggle w={280} />

        <H size={20} style={{ marginTop: 8, marginBottom: 4 }}>slot disponibili</H>
        <P size={11} style={{ marginBottom: 12 }}>
          mezz'ora prima del volo · entra e incontra
        </P>

        <SlotRow time="13:00" going={2} density={density} />
        <SlotRow time="13:30" going={5} density={density} highlight />
        <SlotRow time="14:00" going={3} density={density} />
        <SlotRow time="14:30" going={7} density={density} />
        <SlotRow time="15:00" going={1} density={density} />
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 1B — Boarding pass rivisitato: header compatto con
// aeroporto + "oggi" di default, tap per cambiare data/ora
// ─────────────────────────────────────────────────────────────
function P1_BoardingCompact({ density = 'rich' }) {
  return (
    <Phone bg={paperWarm}>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
        </div>

        {/* Boarding pass compatto */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, background: '#fff',
          padding: 14, position: 'relative', marginBottom: 14,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 6 }}>
            <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1.5 }}>from</P>
            <div style={{ fontFamily: fontMono, fontSize: 34, fontWeight: 700, lineHeight: 1, color: ink }}>MXP</div>
            <P size={10}>Milano Malpensa</P>
          </div>

          <Squiggle w={280} />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <div>
              <P size={9} style={{ textTransform: 'uppercase' }}>data</P>
              <div style={{ fontFamily: fontMono, fontSize: 16, fontWeight: 700, color: ink }}>
                OGGI <span style={{ fontFamily: fontBody, fontSize: 11, color: accent }}>✎</span>
              </div>
            </div>
            <div>
              <P size={9} style={{ textTransform: 'uppercase' }}>fascia oraria</P>
              <div style={{ fontFamily: fontMono, fontSize: 16, fontWeight: 700, color: ink }}>
                tutto il giorno <span style={{ fontFamily: fontBody, fontSize: 11, color: accent }}>✎</span>
              </div>
            </div>
          </div>

          {/* Perforation circles */}
          <div style={{
            position: 'absolute', left: -8, bottom: 36, width: 16, height: 16,
            borderRadius: '50%', background: paperWarm, border: `2px solid ${ink}`,
          }} />
          <div style={{
            position: 'absolute', right: -8, bottom: 36, width: 16, height: 16,
            borderRadius: '50%', background: paperWarm, border: `2px solid ${ink}`,
          }} />
        </div>

        <H size={18} style={{ textAlign: 'center', marginBottom: 4 }}>
          ↓ chi c'è oggi? ↓
        </H>
        <P size={11} style={{ textAlign: 'center', marginBottom: 12 }}>
          slot da 30 min · join per incontrare
        </P>

        <SlotRow time="13:00" going={2} density={density} />
        <SlotRow time="13:30" going={5} density={density} highlight />
        <SlotRow time="14:00" going={3} density={density} />
        <SlotRow time="14:30" going={7} density={density} />
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 1C — Timeline verticale con header data editabile
// Default "oggi", scroll per orari, nodo gate in fondo
// ─────────────────────────────────────────────────────────────
function P1_TimelineToday({ density = 'rich' }) {
  const slots = [
    { time: '13:00', going: 2 },
    { time: '13:30', going: 5, highlight: true },
    { time: '14:00', going: 3 },
    { time: '14:30', going: 7 },
  ];
  return (
    <Phone bg={paper}>
      <StatusBar />
      <div style={{ padding: '0 18px 16px', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag filled>MXP</Tag>
        </div>

        {/* Data editabile */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 12, padding: '8px 14px',
          background: '#fff', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <P size={9} style={{ textTransform: 'uppercase' }}>data</P>
            <span style={{ fontFamily: fontMono, fontSize: 15, fontWeight: 700 }}>oggi · 06 mag</span>
          </div>
          <div style={{ borderLeft: `1.5px solid ${ink}`, paddingLeft: 12, marginLeft: 12 }}>
            <P size={9} style={{ textTransform: 'uppercase' }}>ora</P>
            <span style={{ fontFamily: fontMono, fontSize: 15, fontWeight: 700 }}>tutto il giorno</span>
          </div>
          <span style={{ fontFamily: fontHand, fontSize: 16, color: accent, marginLeft: 8 }}>✎</span>
        </div>

        <H size={22} style={{ marginBottom: 2 }}>chi c'è<br/><span style={{ color: accent }}>oggi</span> a Malpensa?</H>
        <P style={{ marginBottom: 14 }}>scegli con chi aspettare ✦</P>

        {/* Track */}
        <div style={{ position: 'relative', paddingLeft: 36 }}>
          <svg width="3" height="320" style={{ position: 'absolute', left: 14, top: 8 }}>
            <line x1="1.5" y1="0" x2="1.5" y2="320" stroke={ink} strokeWidth="2" strokeDasharray="4 5" />
          </svg>

          {slots.map((s, i) => (
            <div key={s.time} style={{ position: 'relative', marginBottom: 12 }}>
              <div style={{
                position: 'absolute', left: -28, top: 14,
                width: 18, height: 18, borderRadius: '50%',
                background: s.highlight ? accent : '#fff',
                border: `2px solid ${ink}`,
              }} />
              <div style={{
                border: `2px solid ${ink}`, borderRadius: 14, background: s.highlight ? accentSoft : '#fff',
                padding: '10px 12px', transform: `rotate(${i % 2 ? 0.4 : -0.3}deg)`,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontFamily: fontMono, fontSize: 16, fontWeight: 700, color: ink, lineHeight: 1 }}>{s.time}</div>
                  {density !== 'minimal' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                      <AvatarStack count={s.going} total={s.going} size={20} />
                      <P size={10}>{s.going} qui</P>
                    </div>
                  )}
                </div>
                <SketchBtn small primary={s.highlight}>
                  {s.highlight ? '✓ joined' : 'join'}
                </SketchBtn>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 2 — Dettaglio slot: chi c'è, info, join CTA → chat
// ─────────────────────────────────────────────────────────────
function P2_SlotDetail() {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', note: 'caffè pre-volo?', color: '#ffd5b8' },
    { init: 'L', name: 'Laura', dest: 'AMS', note: 'gate B, arrivo presto', color: '#c9e4ff' },
    { init: 'A', name: 'Alessandro', dest: 'LHR', note: 'birra!', color: '#ffe2ec' },
    { init: 'S', name: 'Sara', dest: 'CDG', note: '', color: '#d8f5c7' },
    { init: 'G', name: 'Giulia', dest: 'BER', note: 'prima volta ✈', color: '#e8d5ff' },
  ];

  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
        </div>

        {/* Slot header */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, padding: 14, background: accentSoft,
          marginBottom: 14, transform: 'rotate(-0.3deg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: 28, fontWeight: 700, color: ink, lineHeight: 1 }}>13:30</div>
              <P size={11}>slot di mezz'ora</P>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Tag filled>MXP</Tag>
              <P size={10} style={{ marginTop: 4 }}>oggi · 06 mag</P>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <AvatarStack count={5} total={5} size={26} />
            <P size={12} style={{ fontWeight: 700 }}>5 persone</P>
          </div>
        </div>

        {/* Info area */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 12, padding: '10px 12px',
          background: '#fff', marginBottom: 14, display: 'flex', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>punto ritrovo</P>
            <div style={{ fontFamily: fontHand, fontSize: 16, fontWeight: 700 }}>Bar Terminal 1</div>
            <P size={10}>vicino gate B · landside</P>
          </div>
          <div style={{ borderLeft: `1.5px solid ${ink}`, paddingLeft: 12 }}>
            <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>durata</P>
            <div style={{ fontFamily: fontMono, fontSize: 16, fontWeight: 700 }}>30 min</div>
            <P size={10}>13:30 → 14:00</P>
          </div>
        </div>

        {/* Partecipanti */}
        <H size={18} style={{ marginBottom: 8 }}>chi c'è</H>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${ink}`, borderRadius: 12, padding: '8px 10px',
              background: '#fff', transform: `rotate(${i % 2 ? 0.3 : -0.2}deg)`,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', background: p.color,
                border: `1.5px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fontHand, fontSize: 16, fontWeight: 700,
              }}>{p.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fontHand, fontSize: 15, fontWeight: 700, lineHeight: 1 }}>{p.name}</div>
                <P size={10}>→ {p.dest}{p.note ? ` · "${p.note}"` : ''}</P>
              </div>
            </div>
          ))}
        </div>

        {/* Join CTA */}
        <SketchBtn primary full>
          join · entra nel gruppo ✈
        </SketchBtn>
        <P size={10} color="rgba(0,0,0,0.4)" style={{ textAlign: 'center', marginTop: 6 }}>
          dopo il join si apre la chat del gruppo
        </P>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 3 — Registrazione rapida post-join
// Nome, destinazione, nota opzionale → conferma → chat
// ─────────────────────────────────────────────────────────────
// PAGE 3A — Slot signup, utente già LOGGATO
//   Solo: destinazione, nota (nome ereditato dal profilo)
function P3a_SlotInfoLogged() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag filled>✓ loggato</Tag>
        </div>

        {/* Conferma slot */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 14, padding: '10px 14px',
          background: accentSoft, marginBottom: 18, textAlign: 'center',
          transform: 'rotate(-0.3deg)',
        }}>
          <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>stai entrando nello slot</P>
          <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 700, color: ink }}>13:30 · MXP</div>
          <P size={11}>oggi · 5 persone già dentro</P>
        </div>

        {/* Account banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: `1.5px solid ${ink}`, borderRadius: 12, padding: '8px 10px',
          background: '#fff', marginBottom: 14,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: '#fff3b8',
            border: `1.5px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 16, fontWeight: 700,
          }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fontHand, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Marco</div>
            <P size={9}>marco@email.com</P>
          </div>
        </div>

        <H size={22} style={{ marginBottom: 4 }}>info per lo slot</H>
        <P size={12} style={{ marginBottom: 16 }}>
          come ti vedono gli altri ✦
        </P>

        <SketchField label="destinazione" placeholder="dove stai andando? (es. BCN)" icon="✈" />
        <SketchField label="una nota (opzionale)" placeholder="es. birra pre-volo? primo viaggio!" icon="💬" />

        <SketchBtn primary full style={{ marginTop: 6 }}>
          conferma e entra ✈
        </SketchBtn>
        <P size={10} color="rgba(0,0,0,0.4)" style={{ textAlign: 'center', marginTop: 6 }}>
          la chat si aprirà 3h prima del meetup
        </P>
      </div>
    </Phone>
  );
}

// PAGE 3B — Slot signup, utente NON loggato (registrazione inline)
function P3b_SlotInfoGuest() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag>guest</Tag>
        </div>

        {/* Conferma slot */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 14, padding: '10px 14px',
          background: accentSoft, marginBottom: 14, textAlign: 'center',
          transform: 'rotate(-0.3deg)',
        }}>
          <P size={10} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>stai entrando nello slot</P>
          <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, color: ink }}>13:30 · MXP</div>
          <P size={10}>oggi · 5 persone già dentro</P>
        </div>

        {/* Sezione 1 — crea account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: accent, color: '#fff',
            border: `2px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontMono, fontSize: 12, fontWeight: 700,
          }}>1</div>
          <H size={18}>Crea account</H>
        </div>
        <SketchField label="nome" placeholder="come ti chiami?" icon="👤" />
        <SketchField label="email" placeholder="tua@email.com" icon="✉" />
        <SketchField label="password" placeholder="almeno 8 caratteri" icon="🔒" />

        <P size={10} style={{ textAlign: 'center', margin: '6px 0 12px' }}>
          hai già un account?{' '}
          <span style={{ color: accent, textDecoration: 'underline', fontWeight: 700 }}>accedi</span>
        </P>

        <Squiggle w={300} />

        {/* Sezione 2 — info slot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '12px 0 8px' }}>
          <div style={{
            width: 22, height: 22, borderRadius: '50%', background: accent, color: '#fff',
            border: `2px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontMono, fontSize: 12, fontWeight: 700,
          }}>2</div>
          <H size={18}>info per lo slot</H>
        </div>
        <SketchField label="destinazione" placeholder="es. BCN" icon="✈" />
        <SketchField label="una nota (opzionale)" placeholder="birra pre-volo?" icon="💬" />

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '6px 0 12px' }}>
          <div style={{
            width: 18, height: 18, border: `2px solid ${ink}`, borderRadius: 4,
            background: accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>✓</div>
          <P size={10}>accetto <u>termini</u> e <u>privacy policy</u></P>
        </div>

        <SketchBtn primary full>
          Crea account e entra ✈
        </SketchBtn>
        <P size={10} color="rgba(0,0,0,0.4)" style={{ textAlign: 'center', marginTop: 6 }}>
          la chat si aprirà 3h prima del meetup
        </P>
      </div>
    </Phone>
  );
}

P3a_SlotInfoLogged; P3b_SlotInfoGuest;
function P3_QuickSignup() { return <P3a_SlotInfoLogged />; }
P3_QuickSignup;

// ─────────────────────────────────────────────────────────────
// PAGE 2b — Dettaglio slot (joined): l'utente è dentro
// Chat bloccata fino a 3h prima del meetup. Countdown all'apertura chat.
// ─────────────────────────────────────────────────────────────
function P2_SlotDetailJoined() {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', note: 'caffè pre-volo?', color: '#ffd5b8' },
    { init: 'L', name: 'Laura', dest: 'AMS', note: 'gate B, arrivo presto', color: '#c9e4ff' },
    { init: 'A', name: 'Aless.', dest: 'LHR', note: 'birra!', color: '#ffe2ec' },
    { init: 'S', name: 'Sara', dest: 'CDG', note: '', color: '#d8f5c7' },
    { init: 'G', name: 'Giulia', dest: 'BER', note: 'prima volta ✈', color: '#e8d5ff' },
    { init: 'TU', name: 'tu', dest: 'BCN', note: 'birra pre-volo?', color: '#fff3b8', me: true },
  ];

  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag filled>✓ sei dentro</Tag>
        </div>

        {/* Slot header */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, padding: 12, background: accentSoft,
          marginBottom: 12, transform: 'rotate(-0.3deg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 700, color: ink, lineHeight: 1 }}>13:30</div>
              <P size={10}>MXP · oggi · Bar T1</P>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AvatarStack count={6} total={6} size={22} />
              <P size={11} style={{ fontWeight: 700 }}>6</P>
            </div>
          </div>
        </div>

        {/* Chat lock + countdown */}
        <div style={{
          border: `2px dashed ${ink}`, borderRadius: 16, padding: 14, background: '#fff',
          marginBottom: 14, transform: 'rotate(0.3deg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>🔒</span>
            <div style={{ fontFamily: fontHand, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              chat in arrivo
            </div>
          </div>
          <P size={11} style={{ marginBottom: 10 }}>
            la chat di gruppo si apre <b>3 ore prima del meetup</b><br/>
            (alle 10:30 di oggi)
          </P>

          {/* Countdown */}
          <div style={{
            border: `2px solid ${ink}`, borderRadius: 12, padding: '10px 8px',
            background: accentSoft, display: 'flex', justifyContent: 'space-around', alignItems: 'center',
            marginBottom: 6,
          }}>
            {[
              { n: '02', l: 'ore' },
              { n: '14', l: 'min' },
              { n: '37', l: 'sec' },
            ].map((t, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, color: ink, lineHeight: 1 }}>{t.n}</div>
                  <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>{t.l}</P>
                </div>
                {i < 2 && <span style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700 }}>:</span>}
              </React.Fragment>
            ))}
          </div>
          <P size={10} color="rgba(0,0,0,0.5)" style={{ textAlign: 'center' }}>
            ⏰ all'apertura della chat
          </P>
        </div>

        {/* Partecipanti */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <H size={16}>chi c'è</H>
          <P size={10}>vi parlerete in chat ✦</P>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: p.me ? `2px solid ${accent}` : `1.5px solid ${ink}`,
              borderRadius: 12, padding: '6px 10px',
              background: p.me ? accentSoft : '#fff',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: p.color,
                border: `1.5px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fontHand, fontSize: 13, fontWeight: 700,
              }}>{p.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fontHand, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
                  {p.name}{p.me && <span style={{ fontFamily: fontBody, fontSize: 9, marginLeft: 6, color: accent }}>(tu)</span>}
                </div>
                <P size={9}>→ {p.dest}{p.note ? ` · "${p.note}"` : ''}</P>
              </div>
            </div>
          ))}
        </div>

        {/* Esci */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: fontBody, fontSize: 11, color: inkSoft, textDecoration: 'underline', cursor: 'pointer' }}>
            esci dallo slot
          </span>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 5 — Chat di gruppo (countdown finito)
// ─────────────────────────────────────────────────────────────
function P5_GroupChat() {
  const messages = [
    { from: 'Marco', init: 'M', color: '#ffd5b8', text: 'ciao a tutti! io sono al gate B già', time: '10:32', me: false },
    { from: 'Laura', init: 'L', color: '#c9e4ff', text: 'arrivo tra 20 min, prendo il treno', time: '10:35', me: false },
    { from: 'tu', init: 'TU', color: '#fff3b8', text: 'ci vediamo al Bar T1 alle 13:30 ✦', time: '10:38', me: true },
    { from: 'Aless.', init: 'A', color: '#ffe2ec', text: 'perfetto, birra paga chi arriva ultimo 🍺', time: '10:40', me: false },
    { from: 'Sara', init: 'S', color: '#d8f5c7', text: 'haha sto correndo!!', time: '10:41', me: false },
    { from: 'Giulia', init: 'G', color: '#e8d5ff', text: 'porto le carte da gioco', time: '10:43', me: false },
  ];

  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: 0, height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Header chat */}
        <div style={{
          padding: '0 14px 10px', borderBottom: `2px solid ${ink}`, background: accentSoft,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fontHand, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              13:30 · Bar T1
            </div>
            <P size={10}>MXP · 6 persone · meetup tra 2h 50'</P>
          </div>
          <AvatarStack count={6} total={6} size={22} />
        </div>

        {/* Banner apertura */}
        <div style={{
          margin: '10px 14px 8px', padding: '6px 10px',
          border: `1.5px dashed ${ink}`, borderRadius: 10, background: '#fff',
          textAlign: 'center',
        }}>
          <P size={10}>
            ✨ chat aperta · meetup alle <b>13:30</b> al <b>Bar T1</b>
          </P>
        </div>

        {/* Messaggi */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex', gap: 6, alignItems: 'flex-end',
              flexDirection: m.me ? 'row-reverse' : 'row',
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%', background: m.color,
                border: `1.5px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fontHand, fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>{m.init}</div>
              <div style={{ maxWidth: '72%' }}>
                {!m.me && (
                  <div style={{ fontFamily: fontBody, fontSize: 9, color: inkSoft, marginLeft: 8, marginBottom: 1 }}>
                    {m.from}
                  </div>
                )}
                <div style={{
                  border: `1.5px solid ${ink}`, borderRadius: 12,
                  padding: '6px 10px',
                  background: m.me ? accent : '#fff',
                  color: m.me ? '#fff' : ink,
                  fontFamily: fontBody, fontSize: 12, lineHeight: 1.3,
                  transform: `rotate(${i % 2 ? 0.2 : -0.2}deg)`,
                }}>
                  {m.text}
                </div>
                <div style={{
                  fontFamily: fontMono, fontSize: 8, color: inkSoft,
                  textAlign: m.me ? 'right' : 'left',
                  marginTop: 1, marginRight: m.me ? 4 : 0, marginLeft: m.me ? 0 : 8,
                }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{
          borderTop: `2px solid ${ink}`, padding: '8px 12px', background: '#fff',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            flex: 1, border: `1.5px solid ${ink}`, borderRadius: 999,
            padding: '6px 12px', fontFamily: fontBody, fontSize: 12, color: 'rgba(0,0,0,0.4)',
          }}>
            scrivi un messaggio…
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: accent,
            border: `2px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700,
          }}>↑</div>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE 4b — Notifica/Bridge: countdown finito, chat aperta
// CTA principale per entrare in chat
// ─────────────────────────────────────────────────────────────
function P4b_ChatReady() {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', note: 'caffè pre-volo?', color: '#ffd5b8' },
    { init: 'L', name: 'Laura', dest: 'AMS', note: 'gate B, arrivo presto', color: '#c9e4ff' },
    { init: 'A', name: 'Aless.', dest: 'LHR', note: 'birra!', color: '#ffe2ec' },
    { init: 'S', name: 'Sara', dest: 'CDG', note: '', color: '#d8f5c7' },
    { init: 'G', name: 'Giulia', dest: 'BER', note: 'prima volta ✈', color: '#e8d5ff' },
    { init: 'TU', name: 'tu', dest: 'BCN', note: 'birra pre-volo?', color: '#fff3b8', me: true },
  ];

  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 16px 16px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <Tag filled>✓ sei dentro</Tag>
        </div>

        {/* Slot header */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, padding: 12, background: accentSoft,
          marginBottom: 12, transform: 'rotate(-0.3deg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <div style={{ fontFamily: fontMono, fontSize: 24, fontWeight: 700, color: ink, lineHeight: 1 }}>13:30</div>
              <P size={10}>MXP · oggi · Bar T1</P>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <AvatarStack count={6} total={6} size={22} />
              <P size={11} style={{ fontWeight: 700 }}>6</P>
            </div>
          </div>
        </div>

        {/* Box chat aperta — stesso pattern del countdown */}
        <div style={{
          border: `2px solid ${ink}`, borderRadius: 16, padding: 14, background: '#fff',
          marginBottom: 14, transform: 'rotate(0.3deg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <div style={{ fontFamily: fontHand, fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
              la chat è aperta
            </div>
          </div>
          <P size={11} style={{ marginBottom: 10 }}>
            puoi parlare con il tuo gruppo · meetup tra 2h 50' al Bar T1
          </P>

          {/* CTA al posto del countdown */}
          <SketchBtn primary full>
            apri la chat 💬 →
          </SketchBtn>
        </div>

        {/* Partecipanti */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <H size={16}>chi c'è</H>
          <P size={10}>vi parlerete in chat ✦</P>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: p.me ? `2px solid ${accent}` : `1.5px solid ${ink}`,
              borderRadius: 12, padding: '6px 10px',
              background: p.me ? accentSoft : '#fff',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: p.color,
                border: `1.5px solid ${ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: fontHand, fontSize: 13, fontWeight: 700,
              }}>{p.init}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: fontHand, fontSize: 14, fontWeight: 700, lineHeight: 1 }}>
                  {p.name}{p.me && <span style={{ fontFamily: fontBody, fontSize: 9, marginLeft: 6, color: accent }}>(tu)</span>}
                </div>
                <P size={9}>→ {p.dest}{p.note ? ` · "${p.note}"` : ''}</P>
              </div>
            </div>
          ))}
        </div>

        {/* Esci */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontFamily: fontBody, fontSize: 11, color: inkSoft, textDecoration: 'underline', cursor: 'pointer' }}>
            esci dallo slot
          </span>
        </div>
      </div>
    </Phone>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH — Splash, Login, Registrazione, Recupero password, Profilo
// ─────────────────────────────────────────────────────────────
function A0_Splash() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 54, marginBottom: 12, transform: 'rotate(15deg)', display: 'inline-block' }}>✈</div>
          <Wordmark size={36} />
          <P size={13} style={{ marginTop: 12 }}>
            non aspettare da solo.<br/>incontra chi parte con te.
          </P>
        </div>
        <SketchBtn primary full style={{ marginBottom: 10 }}>Crea account</SketchBtn>
        <SketchBtn full style={{ marginBottom: 18 }}>ho già un account · login</SketchBtn>
        <div style={{ textAlign: 'center', marginBottom: 14 }}>
          <span style={{ fontFamily: fontBody, fontSize: 11, color: inkSoft, textDecoration: 'underline' }}>
            esplora senza account →
          </span>
        </div>
        <div style={{ flex: 1 }} />
        <P size={9} color="rgba(0,0,0,0.4)" style={{ textAlign: 'center' }}>
          continuando accetti termini e privacy
        </P>
      </div>
    </Phone>
  );
}

function A1_Login() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
        </div>
        <H size={32} style={{ marginBottom: 4 }}>bentornato ✦</H>
        <P size={13} style={{ marginBottom: 22 }}>accedi per ritrovare i tuoi slot</P>

        <SketchField label="email" placeholder="tua@email.com" icon="✉" />
        <SketchField label="password" placeholder="••••••••" icon="🔒" />

        <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 18 }}>
          <span style={{ fontFamily: fontBody, fontSize: 11, color: accent, textDecoration: 'underline' }}>
            password dimenticata?
          </span>
        </div>

        <SketchBtn primary full style={{ marginBottom: 14 }}>accedi</SketchBtn>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0' }}>
          <div style={{ flex: 1, height: 1, background: ink }} />
          <P size={10}>oppure</P>
          <div style={{ flex: 1, height: 1, background: ink }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <P size={12}>
            non hai ancora un account?{' '}
            <span style={{ color: accent, textDecoration: 'underline', fontWeight: 700 }}>registrati</span>
          </P>
        </div>
      </div>
    </Phone>
  );
}

function A2_Signup() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
        </div>
        <H size={30} style={{ marginBottom: 4 }}>crea il tuo<br/><span style={{ color: accent }}>account</span></H>
        <P size={13} style={{ marginBottom: 18 }}>basta un minuto ✈</P>

        <SketchField label="nome" placeholder="come ti chiami?" icon="👤" />
        <SketchField label="email" placeholder="tua@email.com" icon="✉" />
        <SketchField label="password" placeholder="almeno 8 caratteri" icon="🔒" />
        <SketchField label="conferma password" placeholder="ripeti password" icon="🔒" />

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 16, marginTop: 4 }}>
          <div style={{
            width: 18, height: 18, border: `2px solid ${ink}`, borderRadius: 4,
            background: accent, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>✓</div>
          <P size={11}>
            accetto <u>termini</u> e <u>privacy policy</u>
          </P>
        </div>

        <SketchBtn primary full style={{ marginBottom: 14 }}>Crea account</SketchBtn>

        <div style={{ textAlign: 'center' }}>
          <P size={12}>
            hai già un account?{' '}
            <span style={{ color: accent, textDecoration: 'underline', fontWeight: 700 }}>accedi</span>
          </P>
        </div>
      </div>
    </Phone>
  );
}

function A3_ForgotPassword() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
        </div>
        <H size={28} style={{ marginBottom: 4 }}>password<br/>dimenticata?</H>
        <P size={13} style={{ marginBottom: 22 }}>
          inserisci la tua email · ti mandiamo un link per resettarla
        </P>

        <SketchField label="email" placeholder="tua@email.com" icon="✉" />

        <SketchBtn primary full style={{ marginTop: 8, marginBottom: 18 }}>
          invia link di reset
        </SketchBtn>

        <div style={{
          border: `2px dashed ${ink}`, borderRadius: 14, padding: 12, background: '#fff',
          transform: 'rotate(-0.4deg)', marginBottom: 14,
        }}>
          <P size={11}>
            🕐 ricontrolla la casella tra qualche minuto.<br/>
            il link scade dopo 1 ora.
          </P>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ fontFamily: fontBody, fontSize: 12, color: accent, textDecoration: 'underline', fontWeight: 700 }}>
            torna al login
          </span>
        </div>
      </div>
    </Phone>
  );
}

function A4_Profile() {
  return (
    <Phone>
      <StatusBar />
      <div style={{ padding: '0 18px 18px', height: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <span style={{ fontFamily: fontHand, fontSize: 20, color: ink }}>←</span>
          <Wordmark size={20} />
          <div style={{ flex: 1 }} />
          <span style={{ fontFamily: fontBody, fontSize: 11, color: accent, textDecoration: 'underline' }}>modifica</span>
        </div>

        {/* Avatar header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: '#fff3b8',
            border: `2px solid ${ink}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: fontHand, fontSize: 36, fontWeight: 700, marginBottom: 8,
          }}>M</div>
          <H size={26} style={{ lineHeight: 1 }}>Marco</H>
          <P size={11}>marco@email.com</P>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'space-around',
          border: `2px solid ${ink}`, borderRadius: 14, padding: '12px 8px',
          background: accentSoft, marginBottom: 18, transform: 'rotate(-0.3deg)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>12</div>
            <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>slot fatti</P>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>34</div>
            <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>incontri</P>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>8</div>
            <P size={9} style={{ textTransform: 'uppercase', letterSpacing: 1 }}>aeroporti</P>
          </div>
        </div>

        {/* Menu */}
        {[
          { ic: '✈', l: 'i miei slot' },
          { ic: '🔔', l: 'notifiche' },
          { ic: '🔒', l: 'sicurezza · password' },
          { ic: '⚙', l: 'impostazioni' },
          { ic: '❓', l: 'aiuto · contatti' },
        ].map((it, i) => (
          <div key={i} style={{
            border: `1.5px solid ${ink}`, borderRadius: 12, padding: '10px 14px',
            background: '#fff', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 16 }}>{it.ic}</span>
            <span style={{ flex: 1, fontFamily: fontBody, fontSize: 13 }}>{it.l}</span>
            <span style={{ fontFamily: fontHand, fontSize: 18 }}>›</span>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <span style={{ fontFamily: fontBody, fontSize: 11, color: inkSoft, textDecoration: 'underline' }}>
            esci · logout
          </span>
        </div>
      </div>
    </Phone>
  );
}

// Expose
Object.assign(window, {
  SketchDefs, Phone, StatusBar, Wordmark, SketchBtn, SketchField,
  AvatarStack, Squiggle, H, P, Tag, SlotRow,
  W0_Empty, W0_NoAirport, W1_Classic, W2_BoardingPass, W3_SearchFirst, W4_Timeline,
  P1_SlotChips, P1_BoardingCompact, P1_TimelineToday, P2_SlotDetail, P2_SlotDetailJoined, P3_QuickSignup, P3a_SlotInfoLogged, P3b_SlotInfoGuest, P4b_ChatReady, P5_GroupChat,
  A0_Splash, A1_Login, A2_Signup, A3_ForgotPassword, A4_Profile,
  PHONE_W, PHONE_H,
});
