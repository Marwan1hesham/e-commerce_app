import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createCategoryDto, IdDto, QueryDto } from './category.dto';
import type { HUserDoc } from 'src/DB/models/user.model';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repositories/category.repository';
import BrandRepository from 'src/DB/repositories/brand.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly brandRepo: BrandRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createCategory(
    body: createCategoryDto,
    file: Express.Multer.File,
    user: HUserDoc,
  ) {
    const { name, brands } = body;

    if (await this.categoryRepo.findOne({ filter: { name } })) {
      throw new ConflictException('Category already exists');
    }

    const strictIds = ([...new Set(brands || [])] as any).map((id) =>
      Types.ObjectId.createFromHexString(id),
    );

    if (
      brands &&
      (await this.brandRepo.find({ filter: { _id: { $in: strictIds } } }))
        ?.length != strictIds.length
    ) {
      throw new NotFoundException('Some of Ids are not found');
    }

    const image = await this.s3Service.uploadFile({
      file,
      path: 'category',
    });

    const category = await this.categoryRepo.create({
      name,
      brands: strictIds,
      image,
      createdBy: user._id,
    });

    return category;
  }
}
