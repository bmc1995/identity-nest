export enum PkceMethod {
  PLAIN = 'plain',
  S256 = 'S256',
}

export type PkceMethodType = keyof typeof PkceMethod;