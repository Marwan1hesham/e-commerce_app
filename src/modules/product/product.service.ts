import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createProductDto } from './product.dto';
import type { HUserDoc } from 'src/DB/models/user.model';
import ProductRepository from 'src/DB/repositories/product.repository';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repositories/category.repository';
import BrandRepository from 'src/DB/repositories/brand.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly brandRepo: BrandRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createProduct(
    body: createProductDto,
    files: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
    user: HUserDoc,
  ) {
    let { name, brandId, categoryId, description, discount, price, stock } =
      body;

    if (!(await this.categoryRepo.findOne({ filter: { _id: categoryId } }))) {
      throw new NotFoundException('categoryId not found');
    }

    if (!(await this.brandRepo.findOne({ filter: { _id: brandId } }))) {
      throw new NotFoundException('brandId not found');
    }

    price = price - (price * (discount || 0)) / 100;

    const mainImage = await this.s3Service.uploadFile({
      file: files.mainImage[0],
      path: 'products/mainImage',
    });

    let subImages;
    if (files.subImages.length > 0) {
      subImages = await this.s3Service.uploadFiles({
        files: files.subImages,
        path: 'products/subImages',
      });
    }

    const product = await this.productRepo.create({
      name,
      brandId,
      categoryId,
      discount,
      mainImage,
      subImages,
      description,
      price,
      stock,
      createdBy: user._id,
    });

    return product;
  }
}
