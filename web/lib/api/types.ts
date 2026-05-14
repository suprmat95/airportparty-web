import type { Profile, Slot, SlotParticipant } from '@/lib/types';

export type ParticipantWithProfile = SlotParticipant & {
  profile: Profile;
};

export type SlotWithParticipants = Slot & {
  participants: ParticipantWithProfile[];
};

/**
 * Slot shown in the timeline. Either a real DB row (with possibly empty
 * participants) or a virtual placeholder generated client-side for an
 * (airport, date, hour) tuple that nobody has joined yet.
 */
export type TimelineSlot = SlotWithParticipants & {
  isVirtual: boolean;
};

export type MyJoinedSlot = Slot & {
  destination: string;
  note: string;
  airportCity: string;
  airportName: string;
  participantsCount: number;
};

export type MessageWithProfile = {
  id: string;
  slotId: string;
  userId: string;
  text: string;
  createdAt: string;
  profile: Pick<Profile, 'name' | 'avatarColor'>;
};

export type ProfileStats = {
  slots: number;
  encounters: number;
  airports: number;
};
