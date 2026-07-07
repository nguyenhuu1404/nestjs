import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true; // route không yêu cầu permission -> cho qua

    const { user } = context.switchToHttp().getRequest();
    const hasPermission = required.every((p) => user.permissions?.includes(p));

    if (!hasPermission) throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
    return true;
  }
}
