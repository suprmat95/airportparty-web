'use client';

import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

type Props = {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function ChatInput({ onSend, placeholder = 'Scrivi un messaggio…', disabled }: Props) {
  const [text, setText] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value || disabled) return;
    onSend(value);
    setText('');
  }

  return (
    <form
      onSubmit={submit}
      className="sticky bottom-0 -mx-5 mt-3 border-t border-line bg-bg/95 px-5 py-3 backdrop-blur"
    >
      <div className="flex items-center gap-2 rounded border border-line bg-card px-3.5 py-2 transition focus-within:border-primary">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-[14px] font-medium text-ink placeholder:font-normal placeholder:text-ink-muted focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !text.trim()}
          aria-label="Invia"
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white transition active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
    </form>
  );
}
