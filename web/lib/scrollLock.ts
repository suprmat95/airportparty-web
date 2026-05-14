'use client';

let counter = 0;
let original: string | null = null;

export function lockScroll() {
  if (typeof document === 'undefined') return;
  if (counter === 0) {
    original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  counter++;
}

export function unlockScroll() {
  if (typeof document === 'undefined') return;
  if (counter === 0) return;
  counter--;
  if (counter === 0) {
    document.body.style.overflow = original ?? '';
    original = null;
  }
}
