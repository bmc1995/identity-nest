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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserViewDto } from './dto/user-response.dto';

/**
 * Admin REST API for managing user accounts.
 *
 * All routes require a valid admin session enforced by {@link AdminGuard}.
 * Mounts under `/api/v1/users`.
 */
@ApiTags('users')
@ApiCookieAuth('idp_session')
@ApiUnauthorizedResponse({ description: 'Missing or invalid admin session' })
@ApiForbiddenResponse({ description: 'Authenticated user is not an admin' })
@Controller('api/v1/users')
@UseGuards(AdminGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Create a new user account. The initial password is hashed server-side
   * and never returned.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Provisions a user in the given tenant (or the `default` tenant when ' +
      '`tenantId` is omitted). The password is hashed server-side and never returned.',
  })
  @ApiCreatedResponse({ type: UserViewDto })
  @ApiBadRequestResponse({ description: 'Invalid user data or unknown tenant' })
  @ApiConflictResponse({ description: 'Email already in use within the tenant' })
  async create(@Body() dto: CreateUserDto): Promise<UserViewDto> {
    return this.userService.create(dto);
  }

  /** List every user account (admin-facing view). */
  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({ type: [UserViewDto] })
  async list(): Promise<UserViewDto[]> {
    return this.userService.list();
  }

  /**
   * Fetch a single user by its primary-key UUID.
   * @param id — user UUID from the URL path.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single user by UUID' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'User primary-key UUID' })
  @ApiOkResponse({ type: UserViewDto })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserViewDto> {
    return this.userService.getById(id);
  }

  /**
   * Apply a partial update to a user: profile fields, email, lifecycle
   * status (suspend/lock/reactivate), or a password reset.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'User primary-key UUID' })
  @ApiOkResponse({ type: UserViewDto })
  @ApiBadRequestResponse({ description: 'Invalid user data' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  @ApiConflictResponse({ description: 'Email already in use within the tenant' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserViewDto> {
    return this.userService.update(id, dto);
  }

  /**
   * Soft-delete a user. The record is retained for audit/recovery but
   * excluded from all subsequent reads.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete a user' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'User primary-key UUID' })
  @ApiNoContentResponse({ description: 'User soft-deleted' })
  @ApiNotFoundResponse({ description: 'User does not exist' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
