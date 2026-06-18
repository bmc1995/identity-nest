import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ClientRegistrationDto } from '../dto/client-registration.dto';
import {
  ClientRegistrationResponse,
  DynamicClientRegistrationService,
} from '../services/dynamic-client-registration/dynamic-client-registration.service';
import { RegistrationAccessTokenGuard } from '../guards/registration-access-token.guard';
import { RegistrationRateLimitGuard } from '../guards/registration-rate-limit.guard';

/**
 * OAuth 2.0 Dynamic Client Registration (RFC 7591).
 *
 * Gated by an initial access token (RFC 7591 §1.2): callers must present
 * `Authorization: Bearer <OIDC_REGISTRATION_ACCESS_TOKEN>`. When that env var
 * is unset the endpoint is disabled entirely — see
 * {@link RegistrationAccessTokenGuard}.
 */
@ApiTags('oidc')
@ApiBearerAuth('initial-access-token')
@Controller('oidc')
export class ClientRegistrationController {
  private readonly logger = new Logger(ClientRegistrationController.name);

  constructor(
    private readonly registration: DynamicClientRegistrationService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  // Rate limit runs first so it throttles invalid-token attempts too.
  @UseGuards(RegistrationRateLimitGuard, RegistrationAccessTokenGuard)
  @ApiOperation({
    summary: 'Dynamically register a client (RFC 7591)',
    description:
      'Accepts RFC 7591 client metadata and returns the issued `client_id` ' +
      '(and a one-time `client_secret` for confidential clients). Requires a ' +
      'valid initial access token.',
  })
  @ApiCreatedResponse({ description: 'Client successfully registered' })
  @ApiBadRequestResponse({
    description: 'invalid_client_metadata or invalid_redirect_uri',
  })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid initial access token',
  })
  @ApiForbiddenResponse({
    description: 'Dynamic client registration is disabled',
  })
  @ApiTooManyRequestsResponse({
    description: 'Registration rate limit exceeded',
  })
  async register(
    @Body() dto: ClientRegistrationDto,
  ): Promise<ClientRegistrationResponse> {
    this.logger.log('Dynamic client registration request');
    return this.registration.register(dto);
  }
}
