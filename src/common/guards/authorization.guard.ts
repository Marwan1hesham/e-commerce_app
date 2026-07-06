import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import TokenService from '../services/token.service';
import { Reflector } from '@nestjs/core';
import { access_roles_key } from '../decorators/auth.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflactor: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const Roles = this.reflactor.get(
        access_roles_key,
        context.getHandler(),
      ) as string[];

      let req: any;

      if (context.getType() === 'http') {
        req = context.switchToHttp().getRequest();
      } else if (context.getType() === 'rpc') {
        //   req = context.switchToRpc().getContext();
        //   authorization =
      } else if (context.getType() === 'ws') {
        //   req = context.switchToWs().getClient();
        //   authorization =
      }

      if (!Roles.includes(req.user.role)) {
        throw new UnauthorizedException('You are unauthorized');
      }

      return true;
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
