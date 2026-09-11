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
