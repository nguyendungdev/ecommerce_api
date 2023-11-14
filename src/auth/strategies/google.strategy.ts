import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Role } from '@users/roles.enum';
import { UserService } from '@users/user.service';
import { EmailService } from '@email/email.service';
import { SessionService } from '@sessions/session.service';
import {
  appConfig,
  googleConfig,
  jwtConfig,
} from '../../configs/configs.constants';
import JwtPayload from '../payloads/jwt-payload';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService,
  ) {
    super({
      clientID: googleConfig.id,
      clientSecret: googleConfig.secret,
      callbackURL: `http://localhost:${appConfig.port}/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const email = profile.emails[0].value;
    let roles = [Role.User];
    if (profile.roles) {
      roles = profile.roles[0].value;
    }
    const user = await this.userService.getByEmail(email);
    if (!user) {
      const user = await this.userService.create({
        email,
        password: null,
        roles: [Role.User],
      });
      await user.save();
      await this.emailService.confirmEmail(email);
    }
    const session = await this.sessionService.create(user.id);
    const payload: JwtPayload = { email, roles, session_id: session.id };
    const jwtToken = await this.jwtService.signAsync(payload, {
      secret: jwtConfig.secret,
    });
    done(null, { jwtAccessToken: jwtToken });
  }
}
