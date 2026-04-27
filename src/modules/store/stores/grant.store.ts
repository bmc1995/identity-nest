import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Grant } from '../../../common/entities/grant.entity';
import { ClientApplication } from '../../../common/entities/clientApplication.entity';

export interface StoredGrant {
  id: string;
  userId: string;
  clientId: string;
  scope: string;
  createdAt: Date;
  updatedAt: Date;
  revokedAt: Date | null;
}

@Injectable()
export class GrantStore {
  constructor(
    @InjectRepository(Grant)
    private readonly repo: Repository<Grant>,
    @InjectRepository(ClientApplication)
    private readonly clientRepo: Repository<ClientApplication>,
  ) {}

  async findOrCreate(
    userId: string,
    clientId: string,
    scope: string,
  ): Promise<StoredGrant> {
    // Look for existing active grant via join
    const existing = await this.repo
      .createQueryBuilder('grant')
      .innerJoinAndSelect('grant.client', 'client')
      .innerJoinAndSelect('grant.user', 'user')
      .where('grant.user_id = :userId', { userId })
      .andWhere('client.clientId = :clientId', { clientId })
      .andWhere('grant.revokedAt IS NULL')
      .getOne();

    if (existing) {
      const existingScopes = new Set(existing.scope.split(' '));
      const requestedScopes = scope.split(' ');
      const needsUpdate = requestedScopes.some((s) => !existingScopes.has(s));

      if (needsUpdate) {
        requestedScopes.forEach((s) => existingScopes.add(s));
        existing.scope = Array.from(existingScopes).join(' ');
        const updated = await this.repo.save(existing);
        return this.toStored(updated);
      }
      return this.toStored(existing);
    }

    // Resolve clientId to ClientApplication entity
    const clientEntity = await this.clientRepo.findOneBy({ clientId });
    if (!clientEntity) {
      throw new Error(`Client not found: ${clientId}`);
    }

    try {
      const grant = this.repo.create({
        user: { id: userId },
        client: { id: clientEntity.id },
        scope,
        revokedAt: null,
      });
      const saved = await this.repo.save(grant);
      // Attach relations for toStored mapping
      saved.user = { id: userId } as any;
      saved.client = clientEntity;
      return this.toStored(saved);
    } catch (err: any) {
      // Handle race condition: unique violation on (user, client)
      if (err.code === '23505') {
        return this.findOrCreate(userId, clientId, scope);
      }
      throw err;
    }
  }

  async findById(id: string): Promise<StoredGrant | undefined> {
    const grant = await this.repo.findOne({
      where: { id },
      relations: ['user', 'client'],
    });
    return grant ? this.toStored(grant) : undefined;
  }

  async findByUser(userId: string): Promise<StoredGrant[]> {
    const grants = await this.repo.find({
      where: { user: { id: userId }, revokedAt: IsNull() },
      relations: ['user', 'client'],
    });
    return grants.map((g) => this.toStored(g));
  }

  async findByUserAndClient(
    userId: string,
    clientId: string,
  ): Promise<StoredGrant | undefined> {
    const grant = await this.repo
      .createQueryBuilder('grant')
      .innerJoinAndSelect('grant.client', 'client')
      .innerJoinAndSelect('grant.user', 'user')
      .where('grant.user_id = :userId', { userId })
      .andWhere('client.clientId = :clientId', { clientId })
      .andWhere('grant.revokedAt IS NULL')
      .getOne();

    return grant ? this.toStored(grant) : undefined;
  }

  private toStored(entity: Grant): StoredGrant {
    return {
      id: entity.id,
      userId: entity.user.id,
      clientId: entity.client.clientId,
      scope: entity.scope,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      revokedAt: entity.revokedAt,
    };
  }
}
