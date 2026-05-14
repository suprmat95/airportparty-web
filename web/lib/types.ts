export type AvatarColor =
  | '#FFD5B8'
  | '#C9E4FF'
  | '#FFE2EC'
  | '#D8F5C7'
  | '#E8D5FF'
  | '#FFF3B8';

export const AVATAR_COLORS: AvatarColor[] = [
  '#FFD5B8',
  '#C9E4FF',
  '#FFE2EC',
  '#D8F5C7',
  '#E8D5FF',
  '#FFF3B8',
];

export type Profile = {
  id: string;
  name: string;
  email: string;
  avatarColor: AvatarColor;
};

export type Airport = {
  code: string;
  name: string;
  city: string;
  country: string;
};

export type Slot = {
  id: string;
  airportCode: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  meetingPoint: string;
  meetingNote: string;
};

export type SlotParticipant = {
  id: string;
  slotId: string;
  userId: string;
  destination: string;
  note: string;
  joinedAt: string;
};

export type Message = {
  id: string;
  slotId: string;
  userId: string;
  text: string;
  createdAt: string;
};
