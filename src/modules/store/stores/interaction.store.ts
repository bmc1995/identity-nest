import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CacheService } from '../../../common/cache/cache.service';

const INTERACTION_TTL_SECONDS = 30 * 60;

/**
 * An interaction represents a pending OIDC authorization request that requires
 * user input before it can be completed — typically a login or consent step.
 *
 * When a client hits `/authorize`, the server captures the original request
 * parameters (client_id, redirect_uri, scope, PKCE challenge, etc.) and
 * persists them as an interaction keyed by a random `uid`. The user is then
 * redirected to `/interaction/:uid` where the UI prompts them to authenticate
 * or grant consent. Once the prompt is satisfied, the stored parameters are
 * used to resume the original authorization flow (issue a code, redirect back
 * to the client), and the interaction is deleted.
 *
 * Interactions are short-lived (30 minutes) and expire automatically via Redis TTL.
 *
 * @property uid           Opaque identifier used in the interaction URL.
 * @property prompt        Which step the user is being asked to complete.
 *                         Transitions from `login` → `consent` as the flow progresses.
 * @property params        Snapshot of the original `/authorize` query parameters,
 *                         needed to resume the flow after the prompt is satisfied.
 * @property returnTo      Optional override for where to send the user after the
 *                         prompt completes (defaults to resuming `/authorize`).
 * @property userId        Set once the user has authenticated during this interaction.
 * @property sessionHint   Optional pointer to an existing session (e.g. to re-use
 *                         a logged-in account across prompts).
 */
export interface StoredInteraction {
  uid: string;
  prompt: 'login' | 'consent';
  params: {
    client_id: string;
    redirect_uri: string;
    response_type: string;
    response_mode?: string;
    scope: string;
    state?: string;
    nonce?: string;
    // PKCE applies only to flows that return an authorization code; implicit
    // flows omit the challenge.
    code_challenge?: string;
    code_challenge_method?: string;
  };
  returnTo: string | null;
  userId: string | null;
  sessionHint: string | null;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class InteractionStore {
  constructor(private readonly cache: CacheService) {}

  async create(
    prompt: 'login' | 'consent',
    params: StoredInteraction['params'],
  ): Promise<StoredInteraction> {
    const now = new Date();
    const interaction: StoredInteraction = {
      uid: randomUUID(),
      prompt,
      params,
      returnTo: null,
      userId: null,
      sessionHint: null,
      createdAt: now,
      expiresAt: new Date(now.getTime() + INTERACTION_TTL_SECONDS * 1000),
    };

    await this.cache.setJson(this.uidKey(interaction.uid), interaction, INTERACTION_TTL_SECONDS);
    return interaction;
  }

  async find(uid: string): Promise<StoredInteraction | undefined> {
    const stored = await this.cache.getJson<StoredInteraction>(this.uidKey(uid));
    if (!stored) return undefined;
    return {
      ...stored,
      createdAt: new Date(stored.createdAt),
      expiresAt: new Date(stored.expiresAt),
    };
  }

  async update(
    uid: string,
    updates: Partial<Pick<StoredInteraction, 'prompt' | 'userId' | 'sessionHint'>>,
  ): Promise<StoredInteraction | undefined> {
    const current = await this.find(uid);
    if (!current) return undefined;
    const merged: StoredInteraction = { ...current, ...updates };
    await this.cache.setJsonKeepTtl(this.uidKey(uid), merged);
    return merged;
  }

  async delete(uid: string): Promise<boolean> {
    return this.cache.delete(this.uidKey(uid));
  }

  private uidKey(uid: string): string {
    return `interaction:${uid}`;
  }
}
