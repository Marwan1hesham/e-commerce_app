import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserController } from './auth.controller';
import { UserService } from './auth.service';
import { UserModel } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repositories/user.repository';
import { createClient } from 'redis';
import { RedisService } from 'src/common/services/redis.service';
import { RedisModule } from 'src/common/redis/redis.module';
import TokenService from 'src/common/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/common/middlewares/auth.middleware';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [UserModel, RedisModule, S3Service],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    RedisService,
    TokenService,
    JwtService,
  ],
  exports: [],
})
export class UserModule {}
