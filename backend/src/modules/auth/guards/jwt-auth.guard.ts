import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom, isObservable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../../../common/decorators/public.decorator.js';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isPublic) return this.resolveCanActivate(context);

    // Public endpoints support guests, but should still attach a valid user
    // when the browser sends a bearer token (for example, service booking).
    const request = context.switchToHttp().getRequest<{ headers?: { authorization?: string } }>();
    if (!request.headers?.authorization) return true;

    // Public endpoints should remain accessible when an optional bearer token
    // is invalid, but a valid token should still attach its user to the request.
    return this.resolveCanActivate(context).catch(() => true);
  }

  private async resolveCanActivate(context: ExecutionContext): Promise<boolean> {
    const result = super.canActivate(context);
    if (isObservable(result)) return firstValueFrom(result);
    return result;
  }
}
