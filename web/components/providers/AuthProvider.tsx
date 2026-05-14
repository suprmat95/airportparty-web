'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createClient } from '@/lib/supabase/client';

export type AuthProfile = {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
};

type AuthResult = { error: string | null };

type AuthContextValue = {
  user: AuthProfile | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (name: string, email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(null);
  const [ready, setReady] = useState(false);
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);
  if (!supabaseRef.current) supabaseRef.current = createClient();
  const supabase = supabaseRef.current;

  useEffect(() => {
    let cancelled = false;

    async function loadProfile(userId: string, fallbackEmail: string) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_color')
        .eq('id', userId)
        .maybeSingle();

      if (cancelled) return;

      if (data) {
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          avatarColor: data.avatar_color,
        });
      } else {
        if (error) console.warn('Profile fetch failed:', error.message);
        setUser({
          id: userId,
          name: fallbackEmail.split('@')[0] || 'utente',
          email: fallbackEmail,
          avatarColor: '#FFD5B8',
        });
      }
    }

    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user.id, session.user.email ?? '');
      } else {
        setUser(null);
      }
      if (!cancelled) setReady(true);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer to escape supabase-js auth-lock when calling other methods.
      if (session?.user) {
        const userId = session.user.id;
        const userEmail = session.user.email ?? '';
        setTimeout(() => {
          if (!cancelled) loadProfile(userId, userEmail);
        }, 0);
      } else if (!cancelled) {
        setUser(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signUp = useCallback(
    async (name: string, email: string, password: string): Promise<AuthResult> => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}/auth/reset-password`
          : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
