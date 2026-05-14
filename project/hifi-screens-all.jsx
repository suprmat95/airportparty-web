// ─────────────────────────────────────────────────────────────
// AirportParty — Hi-fi screens (remaining): 03A, 03B, 04, 04b, 05
// Auth: A0, A1, A2, A3, A4   —   all Cielo theme
// ─────────────────────────────────────────────────────────────

// ═══ 03A — Slot info · utente LOGGATO ═══
function HF_S03A({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <HFTag filled theme={t}>✓ loggato</HFTag>
        </div>

        {/* Slot card */}
        <div style={{ borderRadius: t.radius, padding: 16, background: t.primarySoft, marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2 }}>stai entrando nello slot</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 26, fontWeight: 700, color: t.ink, marginTop: 4 }}>13:30 · MXP</div>
          <div style={{ fontSize: 12, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>oggi · 5 persone già dentro</div>
        </div>

        {/* Account banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          border: `1.5px solid ${t.border}`, borderRadius: t.radiusSm, padding: '10px 12px',
          background: t.card, marginBottom: 16, boxShadow: t.shadow,
        }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFF3B8', border: `2px solid ${t.card}`, boxShadow: `0 0 0 1px ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>M</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1 }}>Marco</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500 }}>marco@email.com</div>
          </div>
        </div>

        <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.3 }}>Info per lo slot</h3>
        <p style={{ fontSize: 13, color: t.inkSoft, margin: '0 0 16px', fontWeight: 500 }}>Come ti vedono gli altri</p>

        <HFField label="destinazione" placeholder="Dove stai andando? (es. BCN)" icon="✈" theme={t} />
        <HFField label="una nota (opzionale)" placeholder="Es. birra pre-volo? Primo viaggio!" icon="💬" theme={t} />

        <div style={{ marginTop: 8 }}>
          <HFBtn primary full theme={t}>conferma e entra ✈</HFBtn>
        </div>
        <p style={{ fontSize: 11, color: t.inkMuted, textAlign: 'center', margin: '8px 0 0', fontWeight: 500 }}>
          La chat si aprirà 3h prima del meetup
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ 03B — Registrazione inline · GUEST ═══
function HF_S03B({ theme: t }) {
  const StepBadge = ({ n }) => (
    <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{n}</div>
  );
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <HFTag theme={t}>guest</HFTag>
        </div>

        {/* Slot card */}
        <div style={{ borderRadius: t.radius, padding: 14, background: t.primarySoft, marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2 }}>stai entrando nello slot</div>
          <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.ink, marginTop: 4 }}>13:30 · MXP</div>
          <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>oggi · 5 persone già dentro</div>
        </div>

        {/* Step 1 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <StepBadge n="1" />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Crea account</span>
        </div>
        <HFField label="nome" placeholder="Come ti chiami?" icon="👤" theme={t} />
        <HFField label="email" placeholder="tua@email.com" icon="✉" theme={t} />
        <HFField label="password" placeholder="Almeno 8 caratteri" icon="🔒" theme={t} />
        <p style={{ fontSize: 12, color: t.inkSoft, textAlign: 'center', margin: '4px 0 12px', fontWeight: 500 }}>
          Hai già un account? <span style={{ color: t.primary, fontWeight: 700 }}>accedi</span>
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: t.border, margin: '4px 0 14px' }} />

        {/* Step 2 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <StepBadge n="2" />
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Info per lo slot</span>
        </div>
        <HFField label="destinazione" placeholder="Es. BCN" icon="✈" theme={t} />
        <HFField label="una nota (opzionale)" placeholder="Birra pre-volo?" icon="💬" theme={t} />

        {/* Terms */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0 14px' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
          <span style={{ fontSize: 12, color: t.inkSoft, fontWeight: 500 }}>Accetto <u>termini</u> e <u>privacy policy</u></span>
        </div>

        <HFBtn primary full theme={t}>crea account e entra ✈</HFBtn>
        <p style={{ fontSize: 11, color: t.inkMuted, textAlign: 'center', margin: '8px 0 0', fontWeight: 500 }}>La chat si aprirà 3h prima del meetup</p>
      </div>
    </HFPhone>
  );
}

// ═══ 04 — Sei dentro · countdown chat ═══
function HF_S04({ theme: t }) {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', note: 'caffè pre-volo?', color: '#FFD5B8' },
    { init: 'L', name: 'Laura', dest: 'AMS', note: 'arrivo presto', color: '#C9E4FF' },
    { init: 'A', name: 'Aless.', dest: 'LHR', note: 'birra!', color: '#FFE2EC' },
    { init: 'S', name: 'Sara', dest: 'CDG', note: '', color: '#D8F5C7' },
    { init: 'G', name: 'Giulia', dest: 'BER', note: 'prima volta', color: '#E8D5FF' },
    { init: 'TU', name: 'tu', dest: 'BCN', note: 'birra pre-volo?', color: '#FFF3B8', me: true },
  ];
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <HFTag filled theme={t}>✓ sei dentro</HFTag>
        </div>

        {/* Slot header */}
        <div style={{ borderRadius: t.radius, padding: 14, background: t.primarySoft, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>13:30</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>MXP · oggi · Bar T1</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HFAvatarStack count={6} total={6} size={24} theme={t} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>6</span>
          </div>
        </div>

        {/* Countdown box */}
        <div style={{ border: `1.5px solid ${t.border}`, borderRadius: t.radius, padding: 16, background: t.card, marginBottom: 14, boxShadow: t.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.inkSoft} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>Chat in arrivo</span>
          </div>
          <p style={{ fontSize: 12, color: t.inkSoft, margin: '0 0 12px', fontWeight: 500 }}>
            La chat di gruppo si apre <b>3 ore prima del meetup</b> (alle 10:30 di oggi)
          </p>
          {/* Countdown */}
          <div style={{ borderRadius: t.radiusSm, padding: '12px 8px', background: t.primarySoft, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {[{ n: '02', l: 'ore' }, { n: '14', l: 'min' }, { n: '37', l: 'sec' }].map((c, i) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: t.fontMono, fontSize: 24, fontWeight: 700, lineHeight: 1 }}>{c.n}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{c.l}</div>
                </div>
                {i < 2 && <span style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, color: t.inkMuted }}>:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* People */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: -0.3 }}>chi c'è</h3>
          <span style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500 }}>vi parlerete in chat</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${p.me ? t.primary : t.border}`, borderRadius: t.radiusSm,
              padding: '7px 10px', background: p.me ? t.primarySoft : t.card,
            }}>
              <HFAvatar init={p.init} color={p.color} size={28} theme={t} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{p.name}{p.me && <span style={{ fontSize: 10, color: t.primary, marginLeft: 4 }}>(tu)</span>}</div>
                <div style={{ fontSize: 10, color: t.inkSoft, fontWeight: 500, marginTop: 1 }}>→ {p.dest}{p.note ? ` · ${p.note}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </HFPhone>
  );
}

// ═══ 04b — Chat ready · CTA ═══
function HF_S04b({ theme: t }) {
  const people = [
    { init: 'M', name: 'Marco', dest: 'BCN', color: '#FFD5B8' },
    { init: 'L', name: 'Laura', dest: 'AMS', color: '#C9E4FF' },
    { init: 'A', name: 'Aless.', dest: 'LHR', color: '#FFE2EC' },
    { init: 'S', name: 'Sara', dest: 'CDG', color: '#D8F5C7' },
    { init: 'G', name: 'Giulia', dest: 'BER', color: '#E8D5FF' },
    { init: 'TU', name: 'tu', dest: 'BCN', color: '#FFF3B8', me: true },
  ];
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <HFTag filled theme={t}>✓ sei dentro</HFTag>
        </div>

        {/* Slot header */}
        <div style={{ borderRadius: t.radius, padding: 14, background: t.primarySoft, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>13:30</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>MXP · oggi · Bar T1</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <HFAvatarStack count={6} total={6} size={24} theme={t} />
            <span style={{ fontSize: 13, fontWeight: 700 }}>6</span>
          </div>
        </div>

        {/* Chat ready box */}
        <div style={{ border: `1.5px solid ${t.primary}`, borderRadius: t.radius, padding: 16, background: t.card, marginBottom: 14, boxShadow: t.shadow }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: -0.3 }}>La chat è aperta</span>
          </div>
          <p style={{ fontSize: 12, color: t.inkSoft, margin: '0 0 14px', fontWeight: 500 }}>
            Puoi parlare con il tuo gruppo · meetup tra 2h 50' al Bar T1
          </p>
          <HFBtn primary full theme={t}>apri la chat 💬 →</HFBtn>
        </div>

        {/* People */}
        <h3 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 8px', letterSpacing: -0.3 }}>chi c'è</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {people.map((p, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              border: `1.5px solid ${p.me ? t.primary : t.border}`, borderRadius: t.radiusSm,
              padding: '7px 10px', background: p.me ? t.primarySoft : t.card,
            }}>
              <HFAvatar init={p.init} color={p.color} size={28} theme={t} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{p.name}{p.me && <span style={{ fontSize: 10, color: t.primary, marginLeft: 4 }}>(tu)</span>}</div>
                <div style={{ fontSize: 10, color: t.inkSoft, fontWeight: 500, marginTop: 1 }}>→ {p.dest}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 11, color: t.inkMuted, textAlign: 'center', margin: '12px 0 0', fontWeight: 500, textDecoration: 'underline' }}>esci dallo slot</p>
      </div>
    </HFPhone>
  );
}

// ═══ 05 — Group chat ═══
function HF_S05({ theme: t }) {
  const msgs = [
    { from: 'Marco', init: 'M', color: '#FFD5B8', text: 'Ciao a tutti! Io sono al gate B già', time: '10:32', me: false },
    { from: 'Laura', init: 'L', color: '#C9E4FF', text: 'Arrivo tra 20 min, prendo il treno', time: '10:35', me: false },
    { from: 'tu', init: 'TU', color: '#FFF3B8', text: 'Ci vediamo al Bar T1 alle 13:30 ✦', time: '10:38', me: true },
    { from: 'Aless.', init: 'A', color: '#FFE2EC', text: 'Perfetto, birra paga chi arriva ultimo', time: '10:40', me: false },
    { from: 'Sara', init: 'S', color: '#D8F5C7', text: 'Haha sto correndo!!', time: '10:41', me: false },
    { from: 'Giulia', init: 'G', color: '#E8D5FF', text: 'Porto le carte da gioco', time: '10:43', me: false },
  ];
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Chat header */}
        <div style={{ padding: '0 16px 12px', borderBottom: `1.5px solid ${t.border}`, background: t.primarySoft, display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, lineHeight: 1, letterSpacing: -0.3 }}>13:30 · Bar T1</div>
            <div style={{ fontSize: 11, color: t.inkSoft, fontWeight: 500, marginTop: 2 }}>MXP · 6 persone · meetup tra 2h 50'</div>
          </div>
          <HFAvatarStack count={6} total={6} size={22} theme={t} />
        </div>

        {/* Info banner */}
        <div style={{ margin: '10px 16px 6px', padding: '6px 12px', borderRadius: t.radiusSm, background: t.cardAlt, border: `1px solid ${t.border}`, textAlign: 'center' }}>
          <span style={{ fontSize: 11, color: t.inkSoft, fontWeight: 600 }}>✨ Chat aperta · meetup alle <b>13:30</b> al <b>Bar T1</b></span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflow: 'hidden', padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-end', flexDirection: m.me ? 'row-reverse' : 'row' }}>
              <HFAvatar init={m.init} color={m.color} size={24} theme={t} />
              <div style={{ maxWidth: '72%' }}>
                {!m.me && <div style={{ fontSize: 10, color: t.inkMuted, fontWeight: 600, marginLeft: 10, marginBottom: 1 }}>{m.from}</div>}
                <div style={{
                  borderRadius: 16, padding: '8px 12px',
                  background: m.me ? t.primary : t.card,
                  color: m.me ? '#fff' : t.ink,
                  border: m.me ? 'none' : `1.5px solid ${t.border}`,
                  fontSize: 13, fontWeight: 500, lineHeight: 1.35,
                }}>{m.text}</div>
                <div style={{ fontFamily: t.fontMono, fontSize: 9, color: t.inkMuted, textAlign: m.me ? 'right' : 'left', marginTop: 2, marginLeft: m.me ? 0 : 10, marginRight: m.me ? 10 : 0 }}>{m.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div style={{ borderTop: `1.5px solid ${t.border}`, padding: '10px 14px', background: t.card, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, border: `1.5px solid ${t.border}`, borderRadius: t.radiusPill, padding: '8px 14px', fontSize: 13, color: t.inkMuted, fontWeight: 500 }}>
            Scrivi un messaggio…
          </div>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
          </div>
        </div>
      </div>
    </HFPhone>
  );
}

// ═══ A0 — Splash ═══
function HF_A0({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>✈</div>
          <HFWordmark size={32} theme={t} />
          <p style={{ fontSize: 15, color: t.inkSoft, margin: '14px 0 0', fontWeight: 500, lineHeight: 1.5 }}>
            Non aspettare da solo.<br />Incontra chi parte con te.
          </p>
        </div>
        <HFBtn primary full theme={t} style={{ marginBottom: 10 }}>crea account</HFBtn>
        <HFBtn full theme={t} style={{ marginBottom: 20 }}>ho già un account · login</HFBtn>
        <p style={{ fontSize: 12, color: t.primary, textAlign: 'center', fontWeight: 600, textDecoration: 'underline', margin: '0 0 0' }}>
          esplora senza account →
        </p>
        <div style={{ flex: 1 }} />
        <p style={{ fontSize: 10, color: t.inkMuted, textAlign: 'center', margin: 0, fontWeight: 500 }}>
          Continuando accetti termini e privacy
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ A1 — Login ═══
function HF_A1({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.8 }}>Bentornato ✦</h1>
        <p style={{ fontSize: 14, color: t.inkSoft, margin: '0 0 24px', fontWeight: 500 }}>Accedi per ritrovare i tuoi slot</p>

        <HFField label="email" placeholder="tua@email.com" icon="✉" theme={t} />
        <HFField label="password" placeholder="••••••••" icon="🔒" theme={t} />

        <div style={{ textAlign: 'right', marginTop: -4, marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: t.primary, fontWeight: 600 }}>Password dimenticata?</span>
        </div>

        <HFBtn primary full theme={t} style={{ marginBottom: 20 }}>accedi</HFBtn>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '16px 0' }}>
          <div style={{ flex: 1, height: 1, background: t.border }} />
          <span style={{ fontSize: 11, color: t.inkMuted, fontWeight: 600 }}>oppure</span>
          <div style={{ flex: 1, height: 1, background: t.border }} />
        </div>

        <p style={{ fontSize: 13, color: t.inkSoft, textAlign: 'center', margin: '20px 0 0', fontWeight: 500 }}>
          Non hai ancora un account? <span style={{ color: t.primary, fontWeight: 700 }}>registrati</span>
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ A2 — Signup ═══
function HF_A2({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.8, lineHeight: 1.1 }}>
          Crea il tuo<br /><span style={{ color: t.primary }}>account</span>
        </h1>
        <p style={{ fontSize: 14, color: t.inkSoft, margin: '0 0 20px', fontWeight: 500 }}>Basta un minuto ✈</p>

        <HFField label="nome" placeholder="Come ti chiami?" icon="👤" theme={t} />
        <HFField label="email" placeholder="tua@email.com" icon="✉" theme={t} />
        <HFField label="password" placeholder="Almeno 8 caratteri" icon="🔒" theme={t} />
        <HFField label="conferma password" placeholder="Ripeti password" icon="🔒" theme={t} />

        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', margin: '4px 0 16px' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: t.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>✓</div>
          <span style={{ fontSize: 12, color: t.inkSoft, fontWeight: 500 }}>Accetto <u>termini</u> e <u>privacy policy</u></span>
        </div>

        <HFBtn primary full theme={t} style={{ marginBottom: 14 }}>crea account</HFBtn>
        <p style={{ fontSize: 13, color: t.inkSoft, textAlign: 'center', margin: 0, fontWeight: 500 }}>
          Hai già un account? <span style={{ color: t.primary, fontWeight: 700 }}>accedi</span>
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ A3 — Forgot password ═══
function HF_A3({ theme: t }) {
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px', letterSpacing: -0.8, lineHeight: 1.1 }}>
          Password<br />dimenticata?
        </h1>
        <p style={{ fontSize: 14, color: t.inkSoft, margin: '0 0 24px', fontWeight: 500, lineHeight: 1.5 }}>
          Inserisci la tua email · ti mandiamo un link per resettarla
        </p>

        <HFField label="email" placeholder="tua@email.com" icon="✉" theme={t} />

        <HFBtn primary full theme={t} style={{ marginTop: 8, marginBottom: 20 }}>invia link di reset</HFBtn>

        <div style={{ borderRadius: t.radiusSm, padding: 14, background: t.cardAlt, border: `1px solid ${t.border}`, marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: t.inkSoft, margin: 0, fontWeight: 500 }}>
            Ricontrolla la casella tra qualche minuto. Il link scade dopo 1 ora.
          </p>
        </div>

        <p style={{ fontSize: 13, color: t.primary, textAlign: 'center', fontWeight: 700, margin: 0 }}>
          torna al login
        </p>
      </div>
    </HFPhone>
  );
}

// ═══ A4 — Profile ═══
function HF_A4({ theme: t }) {
  const menuItems = [
    { icon: '✈', label: 'I miei slot' },
    { icon: '🔔', label: 'Notifiche' },
    { icon: '🔒', label: 'Sicurezza · password' },
    { icon: '⚙', label: 'Impostazioni' },
    { icon: '❓', label: 'Aiuto · contatti' },
  ];
  return (
    <HFPhone theme={t}>
      <HFStatusBar theme={t} />
      <div style={{ padding: '0 20px 20px', flex: 1, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.ink} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          <HFWordmark size={18} theme={t} />
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 12, color: t.primary, fontWeight: 600 }}>modifica</span>
        </div>

        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF3B8', border: `3px solid ${t.card}`, boxShadow: `0 0 0 2px ${t.border}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800, marginBottom: 8 }}>M</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 2px', letterSpacing: -0.5 }}>Marco</h2>
          <p style={{ fontSize: 12, color: t.inkSoft, margin: 0, fontWeight: 500 }}>marco@email.com</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderRadius: t.radius, padding: '14px 8px', background: t.primarySoft, marginBottom: 18 }}>
          {[{ n: '12', l: 'slot fatti' }, { n: '34', l: 'incontri' }, { n: '8', l: 'aeroporti' }].map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: t.fontMono, fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: t.inkMuted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {menuItems.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              border: `1.5px solid ${t.border}`, borderRadius: t.radiusSm,
              padding: '11px 14px', background: t.card,
            }}>
              <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{it.icon}</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{it.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.inkMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: t.inkMuted, textAlign: 'center', margin: '16px 0 0', fontWeight: 500, textDecoration: 'underline' }}>
          esci · logout
        </p>
      </div>
    </HFPhone>
  );
}

// Expose all
Object.assign(window, {
  HF_S03A, HF_S03B, HF_S04, HF_S04b, HF_S05,
  HF_A0, HF_A1, HF_A2, HF_A3, HF_A4,
});
