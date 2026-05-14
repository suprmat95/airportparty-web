import { Avatar } from './Avatar';
import type { AvatarColor } from '@/lib/types';

export type AvatarStackItem = {
  initials: string;
  color: AvatarColor | string;
};

type Props = {
  items: AvatarStackItem[];
  max?: number;
  size?: number;
};

export function AvatarStack({ items, max = 4, size = 28 }: Props) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;

  return (
    <div className="inline-flex items-center">
      {shown.map((item, i) => (
        <div
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : -8,
            position: 'relative',
            zIndex: shown.length - i,
          }}
        >
          <Avatar initials={item.initials} color={item.color} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'var(--card-alt)',
            border: '2px solid var(--card)',
            boxShadow: '0 0 0 1px var(--line)',
            marginLeft: -8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.38,
            fontWeight: 700,
            color: 'var(--ink-soft)',
            flexShrink: 0,
          }}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
