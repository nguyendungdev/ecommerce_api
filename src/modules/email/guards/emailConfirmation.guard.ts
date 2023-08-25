import {
   Injectable,
   CanActivate,
   ExecutionContext,
   UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
@Injectable()
export class EmailConfirmationGuard implements CanActivate {
   constructor(private readonly userService: UserService) {}
   async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const email = request.user.email;
      const user = await this.userService.getByEmail(email);
      if (!user || !user.isConfirmed) {
         return false;
      }
      return true;
   }
}
