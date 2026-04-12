import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface StoredGrant {
  id: string;
  accountId: string;
  clientId: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
}

@Injectable()
export class GrantStore {
  private grants = new Map<string, StoredGrant>();

  /**
   * Find an existing active grant for this account+client, or create a new one.
   * If the existing grant's scope is a subset of the requested scope, update it.
   */
  findOrCreate(
    accountId: string,
    clientId: string,
    scope: string,
  ): StoredGrant {
    // Look for existing active grant
    for (const grant of this.grants.values()) {
      if (
        grant.accountId === accountId &&
        grant.clientId === clientId &&
        !grant.revokedAt
      ) {
        // Update scope if new scopes were granted
        const existingScopes = new Set(grant.scope.split(' '));
        const requestedScopes = scope.split(' ');
        const needsUpdate = requestedScopes.some((s) => !existingScopes.has(s));

        if (needsUpdate) {
          requestedScopes.forEach((s) => existingScopes.add(s));
          grant.scope = Array.from(existingScopes).join(' ');
          grant.updatedAt = new Date();
        }
        return grant;
      }
    }

    // Create new grant
    const now = new Date();
    const grant: StoredGrant = {
      id: randomUUID(),
      accountId,
      clientId,
      scope,
      createdAt: now,
      updatedAt: now,
      revokedAt: null,
    };
    this.grants.set(grant.id, grant);
    return grant;
  }

  findById(id: string): StoredGrant | undefined {
    return this.grants.get(id);
  }

  findByAccount(accountId: string): StoredGrant[] {
    const grants: StoredGrant[] = [];
    for (const grant of this.grants.values()) {
      if (grant.accountId === accountId && !grant.revokedAt) {
        grants.push(grant);
      }
    }
    return grants;
  }

  findByAccountAndClient(
    accountId: string,
    clientId: string,
  ): StoredGrant | undefined {
    for (const grant of this.grants.values()) {
      if (
        grant.accountId === accountId &&
        grant.clientId === clientId &&
        !grant.revokedAt
      ) {
        return grant;
      }
    }
    return undefined;
  }
}
