import { MapPin, MessageCircle, Users, type LucideIcon } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';

type Step = {
  number: string;
  icon: LucideIcon;
  title: string;
  text: string;
};

const STEPS: Step[] = [
  {
    number: '01',
    icon: MapPin,
    title: 'Scegli aeroporto e orario',
    text: 'Vedi chi sta aspettando nella tua stessa fascia oraria. Senza account.',
  },
  {
    number: '02',
    icon: Users,
    title: 'Unisciti a chi parte',
    text: 'Dici dove vai e, se vuoi, il numero di volo. Trovi chi va dove vai tu.',
  },
  {
    number: '03',
    icon: MessageCircle,
    title: 'Vi trovate al bar',
    text: 'Tre ore prima la chat di gruppo si apre e vi date appuntamento al punto di ritrovo del terminal.',
  },
];

type Props = { className?: string };

/** Three-step explainer for first-time visitors, shown on the airport picker. */
export function HowItWorks({ className }: Props) {
  return (
    <section aria-labelledby="how-it-works" className={className}>
      <h2 id="how-it-works" className="label-cap mb-2.5 ml-1">
        Come funziona
      </h2>
      <ol className="grid gap-3 lg:grid-cols-3">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <li key={step.number}>
              <Card className="flex h-full gap-3 p-4">
                <span className="font-mono text-[13px] font-bold leading-none text-primary">
                  {step.number}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[14px] font-semibold text-ink">
                    <Icon className="h-4 w-4 text-ink-soft" strokeWidth={2} aria-hidden />
                    {step.title}
                  </div>
                  <p className="mt-1 text-[13px] font-normal leading-relaxed text-ink-soft">
                    {step.text}
                  </p>
                </div>
              </Card>
            </li>
          );
        })}
      </ol>
      <p className={cn('mt-3 text-[12px] font-medium text-ink-soft')}>
        Gratis, senza app da scaricare. L’account serve solo per unirti a uno slot.
      </p>
    </section>
  );
}
