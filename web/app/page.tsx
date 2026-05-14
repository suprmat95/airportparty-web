import Link from 'next/link';
import { buttonClass } from '@/components/ui/Button';
import { Wordmark } from '@/components/ui/Wordmark';
import { MobileShell } from '@/components/layout/MobileShell';

export default function SplashPage() {
  return (
    <>
      <MobileShell>
        <div className="flex-1" />

        <div className="mb-9 text-center">
          <div className="mb-3.5 text-5xl leading-none">✈</div>
          <Wordmark size={32} />
          <p className="mx-auto mt-3.5 max-w-[280px] text-[15px] font-medium leading-relaxed text-ink-soft">
            Non aspettare da solo.
            <br />
            Incontra chi parte con te.
          </p>
        </div>

        <Link href="/signup" className={buttonClass('primary', 'md', true, 'mb-2.5')}>
          Crea account
        </Link>

        <Link href="/login" className={buttonClass('secondary', 'md', true, 'mb-5')}>
          ho già un account · login
        </Link>

        <Link
          href="/airport"
          className="block text-center text-xs font-semibold text-primary underline"
        >
          esplora senza account →
        </Link>

        <div className="flex-1" />

        <p className="text-center text-[10px] font-medium text-ink-muted">
          Continuando accetti termini e privacy
        </p>
      </MobileShell>

      {/* Desktop: full-screen senza navbar */}
      <main className="hidden min-h-screen items-center justify-center bg-bg px-6 lg:flex">
        <div className="w-full max-w-[520px] text-center">
          <div className="mb-5 text-[64px] leading-none">✈</div>
          <Wordmark size={40} />
          <p className="mx-auto mt-4 max-w-[420px] text-[17px] font-medium leading-relaxed text-ink-soft">
            Non aspettare da solo.
            <br />
            Incontra chi parte con te.
          </p>

          <div className="mt-9 flex items-center justify-center gap-3">
            <Link href="/signup" className={buttonClass('primary', 'md', false, 'min-w-[180px]')}>
              Crea account
            </Link>
            <Link href="/login" className={buttonClass('secondary', 'md', false, 'min-w-[180px]')}>
              login
            </Link>
          </div>

          <Link
            href="/airport"
            className="mt-6 inline-block text-[13px] font-semibold text-primary underline"
          >
            esplora senza account →
          </Link>

          <p className="mt-10 text-[11px] font-medium text-ink-muted">
            Continuando accetti termini e privacy
          </p>
        </div>
      </main>
    </>
  );
}
