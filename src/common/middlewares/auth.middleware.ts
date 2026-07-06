import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import TokenService from '../services/token.service';
import { TokenEnum } from '../enum/token.enum';

@Injectable()
export class Auth implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // const { authorization } = req.headers;

    // if (!authorization) {
    //   throw new NotFoundException('Authentication error');
    // }

    // const [prefix, token] = authorization.split(' ');

    // const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } =
    //   await this.tokenService.getSignature(prefix);

    // let tokenType = "";
    // prefix === "user" ? tokenType = 

    // let secret_key =
    //   tokenType === TokenEnum.access_token
    //     ? ACCESS_SECRET_KEY
    //     : REFRESH_SECRET_KEY;

    // await this.tokenService.decodeToken_and_fetchUser(token, secret_key);

    next();
  }
}
