import {
   Injectable,
   NestMiddleware,
   BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
   constructor(
      private readonly jwtService: JwtService,
      private readonly userService: UserService,
   ) { }

   async use(req: any, res: any, next: () => void) {
      const jwtToken = req.headers.authorization?.replace('Bearer ', '');

      if (jwtToken) {
         try {
            const decodedJwt = this.jwtService.verify(jwtToken);
            req.user = decodedJwt;
            req.user.isConfirmed = (
               await this.userService.getByEmail(decodedJwt.email)
            ).is_confirmed;
         } catch (error) {
            return;
         }
      }
      next();
   }
}
