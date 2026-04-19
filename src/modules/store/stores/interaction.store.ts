import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { Interaction } from '../../../common/entities/interaction.entity';

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
 * Interactions are short-lived (30 minutes) and expire automatically on read.
 *
 * @property uid           Opaque identifier used in the interaction URL.
 * @property prompt        Which step the user is being asked to complete.
 *                         Transitions from `login` → `consent` as the flow progresses.
 * @property params        Snapshot of the original `/authorize` query parameters,
 *                         needed to resume the flow after the prompt is satisfied.
 * @property returnTo      Optional override for where to send the user after the
 *                         prompt completes (defaults to resuming `/authorize`).
 * @property accountId     Set once the user has authenticated during this interaction.
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
    scope: string;
    state?: string;
    nonce?: string;
    code_challenge: string;
    code_challenge_method: string;
  };
  returnTo: string | null;
  accountId: string | null;
  sessionHint: string | null;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class InteractionStore {
  constructor(
    @InjectRepository(Interaction)
    private readonly repo: Repository<Interaction>,
  ) {}

  async create(
    prompt: 'login' | 'consent',
    params: StoredInteraction['params'],
  ): Promise<StoredInteraction> {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    const interaction = this.repo.create({
      uid: randomUUID(),
      prompt,
      params,
      returnTo: null,
      accountId: null,
      sessionHint: null,
      createdAt: now,
      expiresAt,
    });

    const saved = await this.repo.save(interaction);
    return this.toStored(saved);
  }

  async find(uid: string): Promise<StoredInteraction | undefined> {
    const interaction = await this.repo.findOneBy({ uid });
    if (!interaction) return undefined;
    if (interaction.expiresAt < new Date()) {
      await this.repo.delete(uid);
      return undefined;
    }
    return this.toStored(interaction);
  }

  async update(
    uid: string,
    updates: Partial<Pick<StoredInteraction, 'prompt' | 'accountId' | 'sessionHint'>>,
  ): Promise<StoredInteraction | undefined> {
    const interaction = await this.find(uid);
    if (!interaction) return undefined;
    await this.repo.update(uid, updates);
    return { ...interaction, ...updates };
  }

  async delete(uid: string): Promise<boolean> {
    const result = await this.repo.delete(uid);
    return (result.affected ?? 0) > 0;
  }

  private toStored(entity: Interaction): StoredInteraction {
    return {
      uid: entity.uid,
      prompt: entity.prompt as 'login' | 'consent',
      params: entity.params,
      returnTo: entity.returnTo,
      accountId: entity.accountId,
      sessionHint: entity.sessionHint,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
    };
  }
}
