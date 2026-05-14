import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: ReactNode;
};

export const InputField = forwardRef<HTMLInputElement, Props>(function InputField(
  { label, icon, className, ...rest },
  ref
) {
  return (
    <div className="mb-3">
      {label && <div className="label-cap mb-1.5 ml-1">{label}</div>}
      <div
        className={cn(
          'flex items-center gap-2.5 rounded-[20px] border-[1.5px] border-line bg-card px-4 py-3.5 shadow',
          className
        )}
      >
        {icon && (
          <span className="flex w-5 shrink-0 items-center justify-center text-ink-soft">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className="flex-1 bg-transparent text-[15px] font-semibold text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none"
          {...rest}
        />
      </div>
    </div>
  );
});
