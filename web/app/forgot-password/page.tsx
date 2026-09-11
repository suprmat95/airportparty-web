'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { Card } from '@/components/ui/Card';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { useAuth } from '@/lib/useAuth';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    const { error: resetError } = await resetPassword(email.trim());
    setSubmitting(false);
    if (resetError) {
      setError(resetError);
      return;
    }
    setSent(true);
  }

  const body = sent ? (
    <Card highlight className="p-4 text-[13px] font-medium text-primary-dark">
      Controlla la tua email: il link scade dopo 1 ora.
    </Card>
  ) : (
    <form onSubmit={onSubmit} className="space-y-1">
      <InputField
        label="Email"
        icon={<Mail className="h-5 w-5" strokeWidth={2} />}
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && (
        <div className="mt-2 rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-[12px] font-medium text-error">
          {error}
        </div>
      )}
      <Button type="submit" variant="primary" fullWidth disabled={submitting} className="mt-3">
        {submitting ? 'Invio…' : 'Invia link'}
      </Button>
    </form>
  );

  const securityNote = (
    <div className="mt-4 rounded-sm border border-line bg-card-alt px-3 py-2 text-[11px] font-medium text-ink-soft">
      Il link scade dopo 1 ora per ragioni di sicurezza.
    </div>
  );

  return (
    <>
      <MobileShell>
        <NavBar back="/login" />

        <h1 className="mb-1 text-[28px] font-semibold tracking-tight text-ink">
          Reimposta la password
        </h1>
        <p className="mb-6 text-[14px] font-normal text-ink-soft">
          Ti invieremo un link per impostarne una nuova.
        </p>

        {body}
        {securityNote}

        <div className="flex-1" />

        <p className="text-center text-[12px] font-medium text-ink-soft">
          Hai ricordato?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Torna al login
          </Link>
        </p>
      </MobileShell>

      {/* Desktop: card centrata senza navbar */}
      <main className="hidden min-h-screen items-center justify-center bg-bg px-6 py-10 lg:flex">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 text-center">
            <Link href="/airport">
              <Wordmark size={24} />
            </Link>
          </div>
          <Card className="p-8">
            <h1 className="mb-1 text-[26px] font-semibold tracking-tight text-ink">
              Reimposta la password
            </h1>
            <p className="mb-6 text-[14px] font-normal text-ink-soft">
              Ti invieremo un link per impostarne una nuova.
            </p>
            {body}
            {securityNote}
          </Card>
          <p className="mt-5 text-center text-[12px] font-medium text-ink-soft">
            Hai ricordato?{' '}
            <Link href="/login" className="font-semibold text-primary">
              Torna al login
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
