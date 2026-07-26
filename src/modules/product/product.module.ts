import { Module } from '@nestjs/common';
import UserRepository from 'src/DB/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import TokenService from 'src/common/services/token.service';
import { UserModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { S3Service } from 'src/common/services/s3.service';
import { ProductService } from './product.service';
import { BrandService } from '../brand/brand.service';
import { ProductController } from './product.controller';
import ProductRepository from 'src/DB/repositories/product.repository';
import { ProductModel } from 'src/DB/models/product.model';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { CategoryModel } from 'src/DB/models/category.model';

@Module({
  imports: [UserModel, BrandModel, ProductModel, CategoryModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    BrandService,
    UserRepository,
    JwtService,
    TokenService,
    BrandRepository,
    S3Service,
    ProductRepository,
    CategoryRepository
  ],
})
export class ProductModule {}
