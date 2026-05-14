// ─────────────────────────────────────────────────────────────
// AirportParty — Hi-fi design tokens + base components
// 3 directions: Cielo, Oceano, Aurora
// ─────────────────────────────────────────────────────────────

const THEMES = {
  cielo: {
    name: 'Cielo',
    primary: '#3BA0E3',
    primarySoft: '#E8F4FD',
    primaryDark: '#2178B5',
    accent: '#FF8A65',
    accentSoft: '#FFF0EB',
    bg: '#FAFCFF',
    card: '#FFFFFF',
    cardAlt: '#F0F7FF',
    ink: '#1B2A3D',
    inkSoft: '#6B8299',
    inkMuted: '#A3B8CC',
    border: '#D6E4F0',
    success: '#34C77B',
    error: '#E84855',
    radius: 20,
    radiusSm: 12,
    radiusPill: 999,
    shadow: '0 2px 12px rgba(59,160,227,0.08)',
    shadowLg: '0 8px 32px rgba(59,160,227,0.12)',
    font: "'Nunito', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  oceano: {
    name: 'Oceano',
    primary: '#1A56DB',
    primarySoft: '#EBF0FF',
    primaryDark: '#0F3A94',
    accent: '#FF6B6B',
    accentSoft: '#FFE8E8',
    bg: '#F8F9FC',
    card: '#FFFFFF',
    cardAlt: '#EEF1F8',
    ink: '#111827',
    inkSoft: '#4B5563',
    inkMuted: '#9CA3AF',
    border: '#D1D5DB',
    success: '#10B981',
    error: '#EF4444',
    radius: 16,
    radiusSm: 10,
    radiusPill: 999,
    shadow: '0 2px 12px rgba(26,86,219,0.06)',
    shadowLg: '0 8px 32px rgba(26,86,219,0.10)',
    font: "'DM Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
  aurora: {
    name: 'Aurora',
    primary: '#5B6AE0',
    primarySoft: '#EDEFFF',
    primaryDark: '#3D4ABF',
    accent: '#FFB347',
    accentSoft: '#FFF5E0',
    bg: '#FAFAF8',
    card: '#FFFFFF',
    cardAlt: '#F5F3FF',
    ink: '#1A1A2E',
    inkSoft: '#555570',
    inkMuted: '#9999AD',
    border: '#D8D8E5',
    success: '#22C997',
    error: '#F06060',
    radius: 22,
    radiusSm: 14,
    radiusPill: 999,
    shadow: '0 2px 12px rgba(91,106,224,0.07)',
    shadowLg: '0 8px 32px rgba(91,106,224,0.11)',
    font: "'Plus Jakarta Sans', sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
};

// ─────────────────────────────────────────────────────────────
// Base hi-fi components (theme-aware)
// ─────────────────────────────────────────────────────────────

const HF_PHONE_W = 375;
const HF_PHONE_H = 812;

function HFPhone({ children, theme: t }) {
  return (
    <div style={{
      width: HF_PHONE_W, height: HF_PHONE_H,
      background: t.bg, borderRadius: 44,
      border: '6px solid #1a1a1a',
      overflow: 'hidden', position: 'relative',
      boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
      fontFamily: t.font, color: t.ink,
    }}>
      {/* Dynamic Island */}
      <div style={{
        position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
        width: 120, height: 34, background: '#1a1a1a', borderRadius: 20, zIndex: 10,
      }} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 54, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  );
}

function HFStatusBar({ theme: t }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 28px 0 32px', height: 16, marginBottom: 8,
      fontSize: 12, fontWeight: 600, color: t.ink, fontFamily: t.fontMono,
    }}>
      <span>9:41</span>
      <span style={{ letterSpacing: 2, fontSize: 11 }}>●●● ◐ ▮</span>
    </div>
  );
}

function HFBtn({ children, primary = false, full = false, small = false, theme: t, style = {} }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      padding: small ? '8px 16px' : '14px 24px',
      background: primary ? t.primary : 'transparent',
      color: primary ? '#fff' : t.ink,
      border: primary ? 'none' : `1.5px solid ${t.border}`,
      borderRadius: t.radiusPill,
      fontFamily: t.font, fontSize: small ? 13 : 15, fontWeight: 700,
      width: full ? '100%' : 'auto',
      boxShadow: primary ? t.shadow : 'none',
      letterSpacing: -0.2,
      ...style,
    }}>
      {children}
    </div>
  );
}

function HFField({ label, value, placeholder, icon, theme: t }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <div style={{
          fontSize: 11, fontWeight: 700, color: t.inkSoft,
          textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6, marginLeft: 4,
        }}>{label}</div>
      )}
      <div style={{
        border: `1.5px solid ${t.border}`, borderRadius: t.radius, padding: '13px 16px',
        background: t.card, display: 'flex', alignItems: 'center', gap: 10,
        fontSize: 15, color: value ? t.ink : t.inkMuted,
        boxShadow: t.shadow,
      }}>
        {icon && <span style={{ fontSize: 16, width: 20, textAlign: 'center' }}>{icon}</span>}
        <span style={{ fontWeight: value ? 600 : 400 }}>{value || placeholder}</span>
      </div>
    </div>
  );
}

function HFTag({ children, filled = false, theme: t }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '5px 12px',
      border: filled ? 'none' : `1.5px solid ${t.border}`,
      borderRadius: t.radiusPill,
      background: filled ? t.primarySoft : 'transparent',
      color: filled ? t.primaryDark : t.inkSoft,
      fontSize: 12, fontWeight: 600, letterSpacing: 0.3,
    }}>{children}</span>
  );
}

function HFAvatar({ init, color, size = 28, theme: t }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: color,
      border: `2px solid ${t.card}`, boxShadow: `0 0 0 1px ${t.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.42, fontWeight: 700, color: t.ink,
    }}>{init}</div>
  );
}

function HFAvatarStack({ count = 4, total = null, size = 28, theme: t }) {
  const colors = ['#FFD5B8', '#C9E4FF', '#FFE2EC', '#D8F5C7', '#E8D5FF', '#FFF3B8'];
  const initials = ['M', 'L', 'A', 'S', 'G', 'T'];
  const shown = Math.min(count, 4);
  const rest = (total ?? count) - shown;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {Array.from({ length: shown }).map((_, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, position: 'relative', zIndex: shown - i }}>
          <HFAvatar init={initials[i]} color={colors[i]} size={size} theme={t} />
        </div>
      ))}
      {rest > 0 && (
        <div style={{
          width: size, height: size, borderRadius: '50%', background: t.cardAlt,
          border: `2px solid ${t.card}`, boxShadow: `0 0 0 1px ${t.border}`,
          marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size * 0.38, fontWeight: 700, color: t.inkSoft,
        }}>+{rest}</div>
      )}
    </div>
  );
}

function HFWordmark({ size = 22, theme: t }) {
  return (
    <span style={{
      fontFamily: t.font, fontSize: size, fontWeight: 800, color: t.ink,
      letterSpacing: -0.8, lineHeight: 1,
    }}>
      airport<span style={{ color: t.primary }}>party</span>
    </span>
  );
}

// Expose
Object.assign(window, {
  THEMES, HF_PHONE_W, HF_PHONE_H,
  HFPhone, HFStatusBar, HFBtn, HFField, HFTag, HFAvatar, HFAvatarStack, HFWordmark,
});
