import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { SessionService } from '../auth/session.service';
import { StoredUser } from '../store/stores/user.store';
import { UserService } from '../user/user.service';
import { AdminController } from './admin.controller';
import { AdminViewService } from './admin-view.service';

const COOKIE = 'idp_session';
const ADMIN_EMAIL = 'admin@example.com';

/** Build a {@link StoredUser} with sensible defaults for assertions. */
function makeUser(overrides: Partial<StoredUser> = {}): StoredUser {
  return {
    id: '11111111-1111-1111-1111-111111111111',
    tenantId: '22222222-2222-2222-2222-222222222222',
    email: ADMIN_EMAIL,
    emailVerified: true,
    nickname: null,
    givenName: null,
    familyName: null,
    status: 'active',
    mfaEnabled: false,
    lastLogin: null,
    passwordHash: '$2b$12$hash',
    createdAt: new Date('2026-01-01T00:00:00Z'),
    updatedAt: new Date('2026-01-01T00:00:00Z'),
    ...overrides,
  };
}

function makeRequest(cookies: Record<string, string> = {}): Request {
  return { cookies } as unknown as Request;
}

function makeResponse(): jest.Mocked<Response> {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.redirect = jest.fn();
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res as jest.Mocked<Response>;
}

describe('AdminController', () => {
  let controller: AdminController;
  let sessions: jest.Mocked<SessionService>;
  let users: jest.Mocked<UserService>;

  beforeEach(async () => {
    process.env.ADMIN_EMAILS = ADMIN_EMAIL;

    const sessionsMock: Partial<jest.Mocked<SessionService>> = {
      create: jest.fn(),
      validate: jest.fn(),
      destroy: jest.fn(),
      sign: jest.fn((id: string) => `${id}.sig`),
      unsign: jest.fn(),
      getCookieName: jest.fn(() => COOKIE),
      getTtlMs: jest.fn(() => 3600000),
    };
    const usersMock: Partial<jest.Mocked<UserService>> = {
      findById: jest.fn(),
      verifyCredentials: jest.fn(),
    };
    const viewMock: Partial<jest.Mocked<AdminViewService>> = {
      renderLogin: jest.fn((error?: string) => `login:${error ?? ''}`),
      renderPortal: jest.fn((email: string) => `portal:${email}`),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: SessionService, useValue: sessionsMock },
        { provide: UserService, useValue: usersMock },
        { provide: AdminViewService, useValue: viewMock },
      ],
    }).compile();

    controller = module.get(AdminController);
    sessions = module.get(SessionService);
    users = module.get(UserService);
  });

  afterEach(() => {
    delete process.env.ADMIN_EMAILS;
  });

  describe('portal', () => {
    it('redirects to the login page without a session cookie', async () => {
      const res = makeResponse();

      await controller.portal(makeRequest(), res);

      expect(res.redirect).toHaveBeenCalledWith(303, '/admin/login');
    });

    it('redirects when the session belongs to a non-admin', async () => {
      sessions.unsign.mockReturnValue('sid');
      sessions.validate.mockResolvedValue({
        sessionId: 'sid',
        userId: 'u1',
        authenticatedAt: new Date(),
        expiresAt: new Date(),
      });
      users.findById.mockResolvedValue(makeUser({ email: 'user@example.com' }));
      const res = makeResponse();

      await controller.portal(makeRequest({ [COOKIE]: 'sid.sig' }), res);

      expect(res.redirect).toHaveBeenCalledWith(303, '/admin/login');
    });

    it('renders the portal for an admin session', async () => {
      sessions.unsign.mockReturnValue('sid');
      sessions.validate.mockResolvedValue({
        sessionId: 'sid',
        userId: 'u1',
        authenticatedAt: new Date(),
        expiresAt: new Date(),
      });
      users.findById.mockResolvedValue(makeUser());
      const res = makeResponse();

      await controller.portal(makeRequest({ [COOKIE]: 'sid.sig' }), res);

      expect(res.send).toHaveBeenCalledWith(`portal:${ADMIN_EMAIL}`);
      expect(res.redirect).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('re-renders the login page on bad credentials without creating a session', async () => {
      users.verifyCredentials.mockResolvedValue(null);
      const res = makeResponse();

      await controller.login({ email: ADMIN_EMAIL, password: 'wrong' }, res);

      expect(sessions.create).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(
        'login:Invalid credentials or not an administrator',
      );
    });

    it('rejects valid credentials of a non-admin without creating a session', async () => {
      users.verifyCredentials.mockResolvedValue(
        makeUser({ email: 'user@example.com' }),
      );
      const res = makeResponse();

      await controller.login({ email: 'user@example.com', password: 'pw' }, res);

      expect(sessions.create).not.toHaveBeenCalled();
      expect(res.cookie).not.toHaveBeenCalled();
    });

    it('creates a session, sets a httpOnly cookie, and redirects for an admin', async () => {
      users.verifyCredentials.mockResolvedValue(makeUser());
      sessions.create.mockResolvedValue({
        sessionId: 'sid',
        userId: 'u1',
        authenticatedAt: new Date(),
        expiresAt: new Date(),
      });
      const res = makeResponse();

      await controller.login({ email: ADMIN_EMAIL, password: 'pw' }, res);

      expect(sessions.create).toHaveBeenCalledWith(makeUser().id);
      expect(res.cookie).toHaveBeenCalledWith(
        COOKIE,
        'sid.sig',
        expect.objectContaining({ httpOnly: true, sameSite: 'lax' }),
      );
      expect(res.redirect).toHaveBeenCalledWith(303, '/admin');
    });
  });

  describe('logout', () => {
    it('destroys the session, clears the cookie, and redirects to login', async () => {
      sessions.unsign.mockReturnValue('sid');
      const res = makeResponse();

      await controller.logout(makeRequest({ [COOKIE]: 'sid.sig' }), res);

      expect(sessions.destroy).toHaveBeenCalledWith('sid');
      expect(res.clearCookie).toHaveBeenCalledWith(COOKIE, { path: '/' });
      expect(res.redirect).toHaveBeenCalledWith(303, '/admin/login');
    });

    it('still clears the cookie when no session cookie is present', async () => {
      const res = makeResponse();

      await controller.logout(makeRequest(), res);

      expect(sessions.destroy).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith(COOKIE, { path: '/' });
      expect(res.redirect).toHaveBeenCalledWith(303, '/admin/login');
    });
  });
});
