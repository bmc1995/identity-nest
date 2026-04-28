import {
  Controller,
  Get,
  Logger,
  Post,
  Param,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionService } from '../../auth/session.service';
import { UserService } from '../../user/user.service';
import { InteractionStore } from '../../store/stores/interaction.store';
import { OidcService } from '../oidc.service';
import { InteractionViewService } from '../services/interaction-view/interaction-view.service';
import { LoginDto } from '../dto/login.dto';
import { ConsentDto } from '../dto/consent.dto';

@Controller('interaction')
export class InteractionController {
  private readonly logger = new Logger(InteractionController.name);

  constructor(
    private readonly sessions: SessionService,
    private readonly users: UserService,
    private readonly interactionStore: InteractionStore,
    private readonly oidcService: OidcService,
    private readonly view: InteractionViewService,
  ) {}

  @Get(':uid')
  async showInteraction(
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction) {
      this.logger.warn(`Interaction not found: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    if (interaction.prompt === 'login') {
      return res.status(200).header('Content-Type', 'text/html').send(
        this.view.renderLogin(uid, interaction.params.client_id),
      );
    }

    if (interaction.prompt === 'consent') {
      const scopes = interaction.params.scope.split(' ');
      return res.status(200).header('Content-Type', 'text/html').send(
        this.view.renderConsent(uid, interaction.params.client_id, scopes),
      );
    }

    this.logger.error(`Unknown interaction prompt "${interaction.prompt}" for uid=${uid}`);
    throw new HttpException('Unknown interaction prompt', HttpStatus.BAD_REQUEST);
  }

  @Post(':uid/login')
  async submitLogin(
    @Param('uid') uid: string,
    @Body() body: LoginDto,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction || interaction.prompt !== 'login') {
      this.logger.warn(`Login submission for invalid or expired interaction: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    const user = await this.users.verifyCredentials(body.email, body.password);
    if (!user) {
      this.logger.warn(`Failed login attempt on interaction=${uid}`);
      return res.status(200).header('Content-Type', 'text/html').send(
        this.view.renderLogin(uid, interaction.params.client_id, 'Invalid email or password'),
      );
    }

    const session = await this.sessions.create(user.id);
    res.cookie(this.sessions.getCookieName(), this.sessions.sign(session.sessionId), {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: this.sessions.getTtlMs(),
      path: '/',
    });

    await this.interactionStore.update(uid, {
      prompt: 'consent',
      userId: user.id,
    });

    return res.redirect(303, `/interaction/${uid}`);
  }

  @Post(':uid/consent')
  async submitConsent(
    @Param('uid') uid: string,
    @Body() body: ConsentDto,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction || interaction.prompt !== 'consent' || !interaction.userId) {
      this.logger.warn(`Consent submission for invalid or expired interaction: ${uid}`);
      throw new HttpException('Interaction not found or expired', HttpStatus.BAD_REQUEST);
    }

    if (body.approved !== 'true') {
      this.logger.warn(`User denied consent for client_id=${interaction.params.client_id}, interaction=${uid}`);
      const redirectUri = new URL(interaction.params.redirect_uri);
      redirectUri.searchParams.set('error', 'access_denied');
      redirectUri.searchParams.set('error_description', 'The user denied the authorization request');
      if (interaction.params.state) {
        redirectUri.searchParams.set('state', interaction.params.state);
      }
      await this.interactionStore.delete(uid);
      return res.redirect(303, redirectUri.toString());
    }

    const redirectUrl = await this.oidcService.completeConsent(interaction);
    await this.interactionStore.delete(uid);
    return res.redirect(303, redirectUrl);
  }

  @Get(':uid/abort')
  async abortInteraction(
    @Param('uid') uid: string,
    @Res() res: Response,
  ) {
    const interaction = await this.interactionStore.find(uid);
    if (!interaction) {
      this.logger.warn(`Abort requested for unknown interaction: ${uid}`);
      throw new HttpException('Interaction not found', HttpStatus.BAD_REQUEST);
    }

    this.logger.warn(`Interaction aborted: uid=${uid}, client_id=${interaction.params.client_id}`);
    const redirectUri = new URL(interaction.params.redirect_uri);
    redirectUri.searchParams.set('error', 'access_denied');
    redirectUri.searchParams.set('error_description', 'The authorization request was aborted');
    if (interaction.params.state) {
      redirectUri.searchParams.set('state', interaction.params.state);
    }
    await this.interactionStore.delete(uid);
    return res.redirect(303, redirectUri.toString());
  }
}
