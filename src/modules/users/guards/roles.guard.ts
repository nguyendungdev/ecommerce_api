import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private reflector: Reflector) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
         context.getHandler(),
         context.getClass(),
      ]);

      if (!requiredRoles) {
         return true;
      }
      const request = context.switchToHttp().getRequest();
      const userRoles: Role[] = request.user?.roles || [];
      const hasRequiredRoles = requiredRoles.every((requiredRole) =>
         userRoles.includes(requiredRole),
      );

      return hasRequiredRoles;
   }
}
