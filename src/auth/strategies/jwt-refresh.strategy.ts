import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConfig } from '@configs/configs.constants';
import JwtRefreshPayload from '../payloads/jwt-refresh-payload';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.refreshSecret,
    });
  }
  async validate(payload: JwtRefreshPayload) {
    if (!payload.session_id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
