import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import TokenService from '../services/token.service';
import { TokenEnum } from '../enum/token.enum';
import { Reflector } from '@nestjs/core';
import { token_type_key } from '../decorators/auth.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private reflactor: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const tokenType = this.reflactor.get(token_type_key, context.getHandler());

    let req: any;
    let authorization: string = '';

    if (context.getType() === 'http') {
      req = context.switchToHttp().getRequest();
      authorization = req.headers.authorization;
    } else if (context.getType() === 'rpc') {
      //   req = context.switchToRpc().getContext();
      //   authorization =
    } else if (context.getType() === 'ws') {
      //   req = context.switchToWs().getClient();
      //   authorization =
    }

    if (!authorization) {
      throw new BadRequestException('Token required');
    }

    const [prefix, token]: string[] = authorization.split(' ');

    if (!token) {
      throw new BadRequestException('Token not found');
    }

    const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } =
      await this.tokenService.getSignature(prefix!);

    let secret_key =
      tokenType === TokenEnum.access_token
        ? ACCESS_SECRET_KEY
        : REFRESH_SECRET_KEY;


    try {
      var { user, decoded } = await this.tokenService.decodeToken_and_fetchUser(
        token,
        secret_key,
      );
    } catch (error) {
      throw new HttpException({ message: 'Invalid token', error }, 400);
    }

    req.user = user;
    req.decoded = decoded;

    return true;
  }
}
