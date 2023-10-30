import {
   Module,
   NestModule,
   MiddlewareConsumer,
   forwardRef,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../modules/users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/configs/configs.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtMiddleware } from './middlewares/jwt.middleware';
import { EmailModule } from '../modules/email/email.module';

@Module({
   imports: [
      UserModule,
      PassportModule,
      forwardRef(() => EmailModule),
      JwtModule.register({
         secret: jwtConfig.secret,
         signOptions: {
            expiresIn: jwtConfig.expiresIn,
         },
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService, JwtStrategy, GoogleStrategy],
   exports: [AuthService, JwtModule],
})
export class AuthModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
      consumer.apply(JwtMiddleware).forRoutes('*');
   }
}
