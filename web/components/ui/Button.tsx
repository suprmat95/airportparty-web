import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSize = 'sm' | 'md';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

const base =
  'inline-flex items-center justify-center gap-1.5 rounded-pill font-bold tracking-tight transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow hover:bg-primary-dark',
  secondary: 'bg-transparent text-ink border-[1.5px] border-line hover:bg-card-alt',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3.5 text-[15px]',
};

export function buttonClass(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  fullWidth = false,
  extra?: string
) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', extra);
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'secondary', size = 'md', fullWidth, className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={buttonClass(variant, size, fullWidth, className)}
      {...rest}
    />
  );
});
