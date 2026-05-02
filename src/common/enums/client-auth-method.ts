export const ClientAuthMethod = {
  CLIENT_SECRET_BASIC: 'client_secret_basic',
  CLIENT_SECRET_POST: 'client_secret_post',
  CLIENT_SECRET_JWT: 'client_secret_jwt',
  NONE: 'none',
} as const;

export type ClientAuthMethod =
  (typeof ClientAuthMethod)[keyof typeof ClientAuthMethod];
