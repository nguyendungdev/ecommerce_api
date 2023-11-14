import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '@configs/configs.constants';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import JwtPayload from '../payloads/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }
  async validate(payload: JwtPayload) {
    const { email, roles, session_id } = payload;
    if (!session_id) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
