'use client';

import { useEffect, type ReactNode } from 'react';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
};

export function BottomSheet({ open, onClose, children, ariaLabel }: Props) {
  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      unlockScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={
        'pointer-events-none fixed inset-0 z-50 transition-opacity duration-200 ' +
        (open ? 'pointer-events-auto opacity-100' : 'opacity-0')
      }
    >
      <button
        type="button"
        aria-label="chiudi"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={
            'pointer-events-auto w-full max-w-[420px] rounded-t-2xl border-t border-line bg-card shadow-lg transition-transform duration-300 ease-out ' +
            (open ? 'translate-y-0' : 'translate-y-full')
          }
        >
          <div className="flex justify-center pt-2.5 pb-1">
            <span className="h-1 w-10 rounded-pill bg-line" aria-hidden />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
