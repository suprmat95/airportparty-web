import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Bordo e sfondo primario (slot evidenziato, stato attivo). */
  highlight?: boolean;
  /** Bordo tratteggiato (stati vuoti, caricamento). */
  dashed?: boolean;
};

export function Card({ highlight, dashed, className, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded border bg-card',
        highlight ? 'border-primary bg-primary-soft' : 'border-line',
        dashed && 'border-dashed',
        className
      )}
      {...rest}
    />
  );
}
