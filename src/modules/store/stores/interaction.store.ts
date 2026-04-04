import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

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
  private interactions = new Map<string, StoredInteraction>();

  create(
    prompt: 'login' | 'consent',
    params: StoredInteraction['params'],
  ): StoredInteraction {
    const uid = randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    const interaction: StoredInteraction = {
      uid,
      prompt,
      params,
      returnTo: null,
      accountId: null,
      sessionHint: null,
      createdAt: now,
      expiresAt,
    };

    this.interactions.set(uid, interaction);
    return interaction;
  }

  find(uid: string): StoredInteraction | undefined {
    const interaction = this.interactions.get(uid);
    if (!interaction) return undefined;
    if (interaction.expiresAt < new Date()) {
      this.interactions.delete(uid);
      return undefined;
    }
    return interaction;
  }

  update(
    uid: string,
    updates: Partial<Pick<StoredInteraction, 'prompt' | 'accountId' | 'sessionHint'>>,
  ): StoredInteraction | undefined {
    const interaction = this.find(uid);
    if (!interaction) return undefined;
    Object.assign(interaction, updates);
    return interaction;
  }

  delete(uid: string): boolean {
    return this.interactions.delete(uid);
  }
}
