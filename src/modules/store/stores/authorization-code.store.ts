import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { AuthorizationCode } from '../../../common/entities/authorizationCode';
import { ClientApplication } from '../../../common/entities/clientApplication.entity';
import { PkceMethod } from '../../../common/enums/PKCEMethod.enum';

export interface StoredAuthorizationCode {
  code: string;
  clientId: string;
  accountId: string;
  grantId: string;
  redirectUri: string;
  scope: string;
  nonce: string | null;
  codeChallenge: string;
  codeChallengeMethod: string;
  createdAt: Date;
  expiresAt: Date;
  consumedAt: Date | null;
}

@Injectable()
export class AuthorizationCodeStore {
  constructor(
    @InjectRepository(AuthorizationCode)
    private readonly repo: Repository<AuthorizationCode>,
    @InjectRepository(ClientApplication)
    private readonly clientRepo: Repository<ClientApplication>,
  ) {}

  async save(params: {
    clientId: string;
    accountId: string;
    grantId: string;
    redirectUri: string;
    scope: string;
    nonce?: string;
    codeChallenge: string;
    codeChallengeMethod: string;
  }): Promise<StoredAuthorizationCode> {
    // Resolve OAuth clientId to ClientApplication UUID PK
    const clientEntity = await this.clientRepo.findOneBy({ clientId: params.clientId });
    if (!clientEntity) {
      throw new Error(`Client not found: ${params.clientId}`);
    }

    const code = randomBytes(32).toString('base64url');
    const now = new Date();

    const authCode = this.repo.create({
      code,
      client: { id: clientEntity.id },
      account: { id: params.accountId },
      grant: { id: params.grantId },
      redirectUri: params.redirectUri,
      scope: params.scope,
      nonce: params.nonce ?? null,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: params.codeChallengeMethod as PkceMethod,
      createdAt: now,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000), // 10 minutes
      consumedAt: null,
    });

    await this.repo.save(authCode);

    return {
      code,
      clientId: params.clientId,
      accountId: params.accountId,
      grantId: params.grantId,
      redirectUri: params.redirectUri,
      scope: params.scope,
      nonce: params.nonce ?? null,
      codeChallenge: params.codeChallenge,
      codeChallengeMethod: params.codeChallengeMethod,
      createdAt: now,
      expiresAt: authCode.expiresAt,
      consumedAt: null,
    };
  }

  async findAndConsume(code: string): Promise<StoredAuthorizationCode | undefined> {
    return this.repo.manager.transaction(async (em) => {
      const authCode = await em.findOne(AuthorizationCode, {
        where: { code, consumedAt: IsNull() },
        relations: ['client', 'account', 'grant'],
      });

      if (!authCode) return undefined;
      if (authCode.expiresAt < new Date()) {
        await em.delete(AuthorizationCode, code);
        return undefined;
      }

      authCode.consumedAt = new Date();
      await em.save(authCode);

      return this.toStored(authCode);
    });
  }

  private toStored(entity: AuthorizationCode): StoredAuthorizationCode {
    return {
      code: entity.code,
      clientId: entity.client.clientId,
      accountId: entity.account.id,
      grantId: entity.grant?.id ?? '',
      redirectUri: entity.redirectUri,
      scope: entity.scope,
      nonce: entity.nonce,
      codeChallenge: entity.codeChallenge,
      codeChallengeMethod: entity.codeChallengeMethod as string,
      createdAt: entity.createdAt,
      expiresAt: entity.expiresAt,
      consumedAt: entity.consumedAt,
    };
  }
}
