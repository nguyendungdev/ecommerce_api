import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { UserService } from '../../modules/users/user.service';
import { appConfig, googleConfig } from '../../configs/configs.constants';
import JwtPayload from '../payloads/jwtPayload';
import { Role } from '../../modules/users/roles.enum';
import EmailService from '../../modules/email/email.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      private readonly emailService: EmailService,
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
         await this.userService.create({
            email,
            password: null,
            roles: [Role.User],
         });
         await this.emailService.confirmEmail(email);
      }
      const payload: JwtPayload = { email, roles };
      const jwtToken = await this.jwtService.signAsync(payload);

      done(null, { jwtAccessToken: jwtToken });
   }
}
