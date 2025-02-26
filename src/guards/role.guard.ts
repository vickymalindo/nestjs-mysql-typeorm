import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<string>(
      'roles',
      context.getHandler(),
    );

    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const userRole = request['user'].role;

    if (!allowedRoles.includes(userRole)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
