'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { MobileShell } from '@/components/layout/MobileShell';
import { NavBar } from '@/components/layout/NavBar';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { useAuth } from '@/lib/useAuth';

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || password.length < 6) {
      setError('Compila nome, email e una password di almeno 6 caratteri.');
      return;
    }
    if (password !== confirm) {
      setError('Le password non corrispondono.');
      return;
    }
    if (!accept) {
      setError('Accetta i termini per continuare.');
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: signUpError } = await signUp(name.trim(), email.trim(), password);
    setSubmitting(false);
    if (signUpError) {
      setError(signUpError);
      return;
    }
    router.push('/airport');
    router.refresh();
  }

  const form = (
    <form onSubmit={onSubmit}>
      <InputField
        label="nome"
        icon={<User className="h-5 w-5" strokeWidth={2} />}
        placeholder="Come ti chiami?"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        label="email"
        icon={<Mail className="h-5 w-5" strokeWidth={2} />}
        type="email"
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="password"
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

      <label className="mb-5 mt-2 flex items-start gap-2.5 text-[12px] font-medium text-ink-soft">
        <input
          type="checkbox"
          checked={accept}
          onChange={(e) => setAccept(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-primary"
        />
        <span>Accetto i termini e la privacy.</span>
      </label>

      {error && (
        <div className="mb-3 rounded-sm border-[1.5px] border-error/30 bg-error/10 px-3 py-2 text-[12px] font-semibold text-error">
          {error}
        </div>
      )}

      <Button type="submit" variant="primary" fullWidth disabled={submitting}>
        {submitting ? 'creo account…' : 'Crea account ✈'}
      </Button>
    </form>
  );

  return (
    <>
      <MobileShell>
        <NavBar back="/" />

        <h1 className="mb-1 text-[28px] font-extrabold tracking-tighter text-ink">
          Crea il tuo account
        </h1>
        <p className="mb-6 text-[14px] font-medium text-ink-soft">
          Bastano 30 secondi.
        </p>

        {form}

        <div className="flex-1" />

        <p className="text-center text-[12px] font-medium text-ink-soft">
          Hai già un account?{' '}
          <Link href="/login" className="font-bold text-primary">
            accedi
          </Link>
        </p>
      </MobileShell>

      {/* Desktop: card centrata senza navbar */}
      <main className="hidden min-h-screen items-center justify-center bg-bg px-6 py-10 lg:flex">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 text-center">
            <Link href="/">
              <Wordmark size={24} />
            </Link>
          </div>
          <div className="rounded-[24px] border border-line bg-card p-8 shadow-lg">
            <h1 className="mb-1 text-[26px] font-extrabold tracking-tighter text-ink">
              Crea il tuo account
            </h1>
            <p className="mb-6 text-[14px] font-medium text-ink-soft">
              Bastano 30 secondi.
            </p>
            {form}
          </div>
          <p className="mt-5 text-center text-[12px] font-medium text-ink-soft">
            Hai già un account?{' '}
            <Link href="/login" className="font-bold text-primary">
              accedi
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
