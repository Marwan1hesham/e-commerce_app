import { Module } from '@nestjs/common';
import UserRepository from 'src/DB/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import TokenService from 'src/common/services/token.service';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/services/s3.service';
import { BrandService } from '../brand/brand.service';
import { BrandController } from '../brand/brand.controller';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { CategoryModel } from 'src/DB/models/category.model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [UserModel, BrandModel, CategoryModel],
  controllers: [CategoryController, BrandController],
  providers: [
    BrandService,
    UserRepository,
    JwtService,
    TokenService,
    BrandRepository,
    S3Service,
    CategoryRepository,
    CategoryService,
  ],
})
export class CategoryModule {}
