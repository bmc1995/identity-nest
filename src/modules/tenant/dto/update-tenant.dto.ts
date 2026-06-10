import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';

/**
 * Shape of the request body for `PATCH /api/v1/tenants/:id`.
 *
 * Every field of {@link CreateTenantDto} becomes optional; only the keys
 * present in the request are applied. The `encryption_key` remains
 * non-updatable through the API.
 */
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
