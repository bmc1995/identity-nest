export const PkceMethod = {
  PLAIN: 'plain',
  S256: 'S256',
} as const;

export type PkceMethod = (typeof PkceMethod)[keyof typeof PkceMethod];
