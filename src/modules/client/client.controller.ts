import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ClientService } from './client.service';
import {
  ClientViewDto,
  ClientWithSecretDto,
} from './dto/client-response.dto';
import { RegisterClientDto } from './dto/register-client.dto';

/**
 * Admin REST API for registering and managing OAuth/OIDC client applications.
 *
 * All routes require a valid admin session enforced by {@link AdminGuard}.
 * Mounts under `/api/v1/clients`.
 */
@ApiTags('clients')
@ApiCookieAuth('idp_session')
@ApiUnauthorizedResponse({ description: 'Missing or invalid admin session' })
@ApiForbiddenResponse({ description: 'Authenticated user is not an admin' })
@Controller('api/v1/clients')
@UseGuards(AdminGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  /**
   * Register a new client application.
   *
   * Returns the full client metadata along with a one-time `clientSecret`
   * (null for public clients). The secret is not retrievable after this
   * response — callers must store it securely or rotate it.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new client application',
    description:
      'Generates an opaque `client_id` and, for confidential clients, a ' +
      'one-time `client_secret`. Applies secure defaults based on the ' +
      'client `type` when optional fields are omitted.',
  })
  @ApiCreatedResponse({ type: ClientWithSecretDto })
  @ApiBadRequestResponse({ description: 'Invalid client metadata' })
  async register(
    @Body() dto: RegisterClientDto,
  ): Promise<ClientWithSecretDto> {
    return this.clientService.register(dto);
  }

  /** List every registered client application (admin-facing view). */
  @Get()
  @ApiOperation({ summary: 'List all registered clients' })
  @ApiOkResponse({ type: [ClientViewDto] })
  async list(): Promise<ClientViewDto[]> {
    return this.clientService.list();
  }

  /**
   * Fetch a single client by its primary-key UUID.
   * @param id — client UUID from the URL path.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single client by UUID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Client primary-key UUID' })
  @ApiOkResponse({ type: ClientViewDto })
  @ApiNotFoundResponse({ description: 'Client does not exist' })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ClientViewDto> {
    return this.clientService.getById(id);
  }

  /**
   * Rotate a confidential client's secret. The old secret stops working
   * immediately; the new plaintext value is returned once.
   */
  @Post(':id/rotate-secret')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Rotate a client secret',
    description:
      'Generates and persists a fresh client secret. The previous secret ' +
      'stops working immediately. Fails for public clients (auth method `none`).',
  })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Client primary-key UUID' })
  @ApiOkResponse({ type: ClientWithSecretDto })
  @ApiBadRequestResponse({ description: 'Client is public and has no secret to rotate' })
  @ApiNotFoundResponse({ description: 'Client does not exist' })
  async rotateSecret(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<ClientWithSecretDto> {
    return this.clientService.rotateSecret(id);
  }
}
