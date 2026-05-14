'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Lock } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { createClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password di almeno 6 caratteri richiesta.');
      return;
    }
    if (password !== confirm) {
      setError('Le password non corrispondono.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push('/airport');
      router.refresh();
    }, 1500);
  }

  const body = done ? (
    <div className="rounded-[20px] border-[1.5px] border-primary bg-primary-soft p-4 text-[13px] font-semibold text-primary-dark">
      ✦ Password aggiornata. Ti stiamo portando dentro…
    </div>
  ) : (
    <form onSubmit={onSubmit} className="space-y-1">
      <InputField
        label="nuova password"
        icon={<Lock className="h-5 w-5" strokeWidth={2} />}
        type="password"
        placeholder="min. 6 caratteri"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputField
        label="conferma password"
        icon={<Lock className="h-5 w-5" strokeWidth={2} />}
        type="password"
        placeholder="ripeti la password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      {error && (
        <div className="mt-2 rounded-sm border-[1.5px] border-error/30 bg-error/10 px-3 py-2 text-[12px] font-semibold text-error">
          {error}
        </div>
      )}
      <Button type="submit" variant="primary" fullWidth disabled={submitting} className="mt-3">
        {submitting ? 'aggiorno…' : 'imposta password'}
      </Button>
    </form>
  );

  return (
    <>
      <MobileShell>
        <NavBar back="/login" />

        <h1 className="mb-1 text-[28px] font-extrabold tracking-tighter text-ink">
          nuova password
        </h1>
        <p className="mb-6 text-[14px] font-medium text-ink-soft">
          Imposta una password sicura per il tuo account.
        </p>

        {body}

        <div className="flex-1" />

        <p className="text-center text-[12px] font-medium text-ink-soft">
          <Link href="/login" className="font-bold text-primary">
            torna al login
          </Link>
        </p>
      </MobileShell>

      <main className="hidden min-h-screen items-center justify-center bg-bg px-6 py-10 lg:flex">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 text-center">
            <Link href="/">
              <Wordmark size={24} />
            </Link>
          </div>
          <div className="rounded-[24px] border border-line bg-card p-8 shadow-lg">
            <h1 className="mb-1 text-[26px] font-extrabold tracking-tighter text-ink">
              nuova password
            </h1>
            <p className="mb-6 text-[14px] font-medium text-ink-soft">
              Imposta una password sicura per il tuo account.
            </p>
            {body}
          </div>
          <p className="mt-5 text-center text-[12px] font-medium text-ink-soft">
            <Link href="/login" className="font-bold text-primary">
              torna al login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
