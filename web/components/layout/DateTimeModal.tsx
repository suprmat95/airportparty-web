'use client';

import { useEffect, type ReactNode } from 'react';
import { lockScroll, unlockScroll } from '@/lib/scrollLock';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel?: string;
};

export function DateTimeModal({ open, onClose, children, ariaLabel }: Props) {
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
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
      />

      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
          className={
            'pointer-events-auto w-full max-w-[480px] rounded-[24px] border border-line bg-card shadow-lg transition-all duration-200 ' +
            (open ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
