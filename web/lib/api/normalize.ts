import type { Slot } from '@/lib/types';
import type {
  MessageWithProfile,
  ParticipantWithProfile,
} from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function normalizeSlot(row: any): Slot {
  return {
    id: row.id,
    airportCode: row.airport_code,
    date: row.date,
    startTime: typeof row.start_time === 'string' ? row.start_time.slice(0, 5) : row.start_time,
    durationMinutes: row.duration_minutes,
    meetingPoint: row.meeting_point ?? '',
    meetingNote: row.meeting_note ?? '',
  };
}

export function normalizeParticipant(row: any, slotId: string): ParticipantWithProfile {
  const profileRow = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    id: row.id,
    slotId,
    userId: row.user_id,
    destination: row.destination ?? '',
    note: row.note ?? '',
    joinedAt: row.joined_at,
    profile: {
      id: profileRow?.id ?? row.user_id,
      name: profileRow?.name ?? '?',
      email: profileRow?.email ?? '',
      avatarColor: profileRow?.avatar_color ?? '#FFD5B8',
    },
  };
}

export function normalizeMessage(row: any): MessageWithProfile {
  const profileRow = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    id: row.id,
    slotId: row.slot_id,
    userId: row.user_id,
    text: row.text,
    createdAt: row.created_at,
    profile: {
      name: profileRow?.name ?? '?',
      avatarColor: profileRow?.avatar_color ?? '#FFD5B8',
    },
  };
}
