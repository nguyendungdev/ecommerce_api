import ms from 'ms';
import * as crypto from 'crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@users/user.service';
import { User } from '@users/entities/user.entity';
import { Session } from '@sessions/entities/session.entity';
import { SessionService } from '@sessions/session.service';
import { ForgotService } from '@forgot/forgot.service';
import { EmailService } from '@email/email.service';
import { jwtConfig } from '@configs/configs.constants';
import { CommonMessage } from '@common/constants/messages.constants';
import AuthCreadentialsDto from './dto/auth-credentials.dto';
import JwtPayload from './payloads/jwt-payload';
import { AuthMessage } from './auth.constants';
import TokenResponseDto from './dto/token-response.dto';
import AuthLoginDto from './dto/auth-login.dto';
import SignUpResponseDto from './dto/signup-response.dto';
import JwtRefreshPayload from './payloads/jwt-refresh-payload';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly forgotService: ForgotService,
    private readonly sessionService: SessionService,
    private readonly emailService: EmailService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCreadentialsDto,
  ): Promise<SignUpResponseDto> {
    const user = await this.usersService.create(authCredentialsDto);
    const session = await this.sessionService.create(user.id);
    const token = await this.emailService.sendVerificationLink(
      authCredentialsDto.email,
    );
    return { token };
  }

  async signIn(authCredentialsDto: AuthLoginDto): Promise<TokenResponseDto> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersService.getByEmail(email);
    if (user && (await user.validatePassword(password)) && user.is_confirmed) {
      const { roles } = await this.usersService.getInfo(email);
      const session = await this.sessionService.create(user.id);
      const payload: JwtPayload = { email, roles, session_id: session.id };
      const { jwtAccessToken, refreshToken, tokenExpires } =
        await this.getTokenData(payload);
      return {
        jwtAccessToken,
        refreshToken,
        tokenExpires,
        sessionId: session.id,
      };
    }
    throw new BadRequestException(AuthMessage.INVALID_CREDENTIALS);
  }

  async refreshToken(sessionId: Session['id']): Promise<TokenResponseDto> {
    const session = await this.sessionService.findOne(sessionId);
    if (!session) {
      throw new UnauthorizedException();
    }
    const payload: JwtPayload = {
      email: session[0].email,
      roles: session[0].roles,
      session_id: sessionId,
    };
    const { jwtAccessToken, refreshToken, tokenExpires } =
      await this.getTokenData(payload);
    return {
      jwtAccessToken,
      refreshToken,
      tokenExpires,
    };
  }

  async logout(sessionId: Session['id']) {
    return this.sessionService.softDelete({ id: sessionId });
  }

  private async getTokenData(payload): Promise<TokenResponseDto> {
    const tokenExpires = Date.now() + ms(jwtConfig.expiresIn);
    const refreshPayload: JwtRefreshPayload = {
      session_id: payload.session_id,
    };
    const [jwtAccessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn,
      }),
      await this.jwtService.signAsync(refreshPayload, {
        secret: jwtConfig.refreshSecret,
        expiresIn: jwtConfig.refreshExpiresIn,
      }),
    ]);
    return {
      jwtAccessToken,
      refreshToken,
      tokenExpires,
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
    await this.forgotService.create(hash, user.id);
    await this.emailService.resetPassword(email, hash);
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOne(hash);
    if (!forgot) {
      throw new NotFoundException(CommonMessage.NOT_FOUND_BY_ID);
    }
    await this.usersService.update(forgot[0].user_id, { password });
    await this.forgotService.softDelete(forgot[0].id);
  }

  async externalSignIn(request): Promise<User> {
    return request.user;
  }
}
