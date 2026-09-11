'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { Mail, Lock } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { useAuth } from '@/lib/useAuth';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get('next') || '/airport';
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      setError('Email valida e password (min. 6 caratteri) richiesti.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  const form = (
    <form onSubmit={onSubmit} className="space-y-1">
      <InputField
        label="Email"
        icon={<Mail className="h-5 w-5" strokeWidth={2} />}
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        icon={<Lock className="h-5 w-5" strokeWidth={2} />}
        type="password"
        placeholder="la tua password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="mb-3 mt-1 text-right">
        <Link
          href="/forgot-password"
          className="text-[12px] font-semibold text-primary underline"
        >
          Password dimenticata?
        </Link>
      </div>

      {error && (
        <div className="mb-2 rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-[12px] font-medium text-error">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting ? 'Accesso…' : 'Accedi'}
      </Button>
    </form>
  );

  return (
    <>
      <MobileShell>
        <NavBar back="/airport" />

        <h1 className="mb-1 text-[28px] font-semibold tracking-tight text-ink">
          Bentornato
        </h1>
        <p className="mb-6 text-[14px] font-normal text-ink-soft">
          Accedi per ritrovare i tuoi slot.
        </p>

        {form}

        <div className="flex-1" />

        <p className="text-center text-[12px] font-medium text-ink-soft">
          Non hai un account?{' '}
          <Link href="/signup" className="font-semibold text-primary">
            Registrati
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
          <div className="rounded border border-line bg-card p-8 shadow-lg">
            <h1 className="mb-1 text-[26px] font-semibold tracking-tight text-ink">
              Bentornato
            </h1>
            <p className="mb-6 text-[14px] font-normal text-ink-soft">
              Accedi per ritrovare i tuoi slot.
            </p>
            {form}
          </div>
          <p className="mt-5 text-center text-[12px] font-medium text-ink-soft">
            Non hai un account?{' '}
            <Link href="/signup" className="font-semibold text-primary">
              Registrati
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
