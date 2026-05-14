import type { AvatarColor } from '@/lib/types';

type Props = {
  initials: string;
  color: AvatarColor | string;
  size?: number;
};

export function Avatar({ initials, color, size = 28 }: Props) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        border: '2px solid var(--card)',
        boxShadow: '0 0 0 1px var(--line)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.42,
        fontWeight: 700,
        color: 'var(--ink)',
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}
