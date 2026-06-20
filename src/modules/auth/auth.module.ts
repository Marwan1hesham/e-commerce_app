import { Module } from '@nestjs/common';
import { UserController } from './auth.controller';
import { UserService } from './auth.service';
import { UserModel } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repositories/user.repository';
import { createClient } from 'redis';
import { RedisService } from 'src/common/services/redis.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [UserModel, RedisModule],
  controllers: [UserController],
  providers: [UserService, UserRepository, RedisService],
  exports: [],
})
export class UserModule {}
