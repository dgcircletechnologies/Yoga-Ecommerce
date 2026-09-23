export const Role = {
  USER: 'USER',
  TRAINER: 'TRAINER',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
