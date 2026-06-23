export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  keyPrefix: string;
}

export interface SessionConfig {
  cookieName: string;
  ttlMs: number;
  cookieSecret: string;
}
export interface RegistrationConfig {
  initialAccessToken: string;
}

export interface AppConfig {
  database: DatabaseConfig;
  redis: RedisConfig;
  session: SessionConfig;
  registration: RegistrationConfig;
}

export default (): AppConfig => ({
  database: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USER ?? 'identity',
    password: process.env.DATABASE_PASSWORD ?? 'identity',
    database: process.env.DATABASE_NAME ?? 'identity',
    synchronize: process.env.NODE_ENV !== 'production',
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    password: process.env.REDIS_PASSWORD || undefined,
    keyPrefix: process.env.REDIS_KEY_PREFIX ?? 'idp:',
  },
  session: {
    cookieName: process.env.SESSION_COOKIE_NAME ?? 'idp_session',
    ttlMs: parseInt(process.env.SESSION_TTL_MS ?? '3600000', 10),
    cookieSecret: process.env.COOKIE_SECRET ?? 'dev-cookie-secret-change-in-production',
  },
  registration: {
    initialAccessToken: process.env.OIDC_REGISTRATION_ACCESS_TOKEN ?? undefined
  }
});
