import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { TenantService } from './tenant.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantViewDto } from './dto/tenant-response.dto';

/**
 * Admin REST API for managing tenants.
 *
 * All routes require a valid admin session enforced by {@link AdminGuard}.
 * Mounts under `/api/v1/tenants`.
 */
@ApiTags('tenants')
@ApiCookieAuth('idp_session')
@ApiUnauthorizedResponse({ description: 'Missing or invalid admin session' })
@ApiForbiddenResponse({ description: 'Authenticated user is not an admin' })
@Controller('api/v1/tenants')
@UseGuards(AdminGuard)
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  /**
   * Create a new tenant. A per-tenant encryption key is generated server-side
   * and is never returned in the response.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new tenant',
    description:
      'Registers a tenant and generates its per-tenant data-encryption key ' +
      'server-side. Tenant names are unique and case-insensitive.',
  })
  @ApiCreatedResponse({ type: TenantViewDto })
  @ApiBadRequestResponse({ description: 'Invalid tenant metadata' })
  @ApiConflictResponse({ description: 'A tenant with the same name already exists' })
  async create(@Body() dto: CreateTenantDto): Promise<TenantViewDto> {
    return this.tenantService.create(dto);
  }

  /** List every tenant (admin-facing view). */
  @Get()
  @ApiOperation({ summary: 'List all tenants' })
  @ApiOkResponse({ type: [TenantViewDto] })
  async list(): Promise<TenantViewDto[]> {
    return this.tenantService.list();
  }

  /**
   * Fetch a single tenant by its primary-key UUID.
   * @param id — tenant UUID from the URL path.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single tenant by UUID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Tenant primary-key UUID' })
  @ApiOkResponse({ type: TenantViewDto })
  @ApiNotFoundResponse({ description: 'Tenant does not exist' })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<TenantViewDto> {
    return this.tenantService.getById(id);
  }

  /**
   * Apply a partial update to a tenant. Only the supplied fields are changed.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a tenant' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Tenant primary-key UUID' })
  @ApiOkResponse({ type: TenantViewDto })
  @ApiBadRequestResponse({ description: 'Invalid tenant metadata' })
  @ApiNotFoundResponse({ description: 'Tenant does not exist' })
  @ApiConflictResponse({ description: 'A tenant with the new name already exists' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTenantDto,
  ): Promise<TenantViewDto> {
    return this.tenantService.update(id, dto);
  }

  /**
   * Soft-delete a tenant. The record is retained for audit/recovery but
   * excluded from all subsequent reads.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a tenant' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Tenant primary-key UUID' })
  @ApiNoContentResponse({ description: 'Tenant soft-deleted' })
  @ApiNotFoundResponse({ description: 'Tenant does not exist' })
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<void> {
    return this.tenantService.remove(id);
  }
}
