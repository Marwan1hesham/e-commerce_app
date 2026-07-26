import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import UserRepository from 'src/DB/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import TokenService from 'src/common/services/token.service';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/services/s3.service';

@Module({
  imports: [UserModel, BrandModel],
  controllers: [BrandController],
  providers: [
    BrandService,
    UserRepository,
    JwtService,
    TokenService,
    BrandRepository,
    S3Service,
  ],
})
export class BrandModule {}
