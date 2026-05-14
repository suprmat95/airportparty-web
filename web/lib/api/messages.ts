import { createClient } from '@/lib/supabase/client';
import { normalizeMessage } from './normalize';
import type { MessageWithProfile } from './types';

export async function fetchMessages(slotId: string): Promise<MessageWithProfile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('id, slot_id, user_id, text, created_at, profiles(name, avatar_color)')
    .eq('slot_id', slotId)
    .order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []).map(normalizeMessage);
}

export async function sendMessage(
  slotId: string,
  text: string
): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { data: userResult } = await supabase.auth.getUser();
  if (!userResult.user) return { error: 'Non sei loggato.' };
  const trimmed = text.trim();
  if (!trimmed) return { error: 'Messaggio vuoto.' };
  const { error } = await supabase.from('messages').insert({
    slot_id: slotId,
    user_id: userResult.user.id,
    text: trimmed,
  });
  return { error: error?.message ?? null };
}
