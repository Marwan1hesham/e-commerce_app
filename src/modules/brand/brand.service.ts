import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createBrandDto, IdDto, QueryDto, updateBrandDto } from './brand.dto';
import type { HUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { S3Service } from 'src/common/services/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepo: BrandRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createBrand(
    body: createBrandDto,
    file: Express.Multer.File,
    user: HUserDoc,
  ) {
    const { name, slogan } = body;

    if (await this.brandRepo.findOne({ filter: { name } })) {
      throw new ConflictException('Name already exist');
    }

    const logo = await this.s3Service.uploadFile({
      file,
      path: 'brands',
    });

    const brand = await this.brandRepo.create({
      name,
      slogan,
      logo,
      createdBy: user._id,
    });

    if (!brand) {
      await this.s3Service.deleteFile(logo);
      throw new BadGatewayException('Failed to craete brand');
    }

    return brand;
  }

  async updateBrand(body: updateBrandDto, id: Types.ObjectId, user: HUserDoc) {
    const { name, slogan } = body;

    const brand = await this.brandRepo.findOne({ filter: { _id: id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (name && name == brand.name) {
      throw new ConflictException("Name didn't change");
    }

    if (brand && (await this.brandRepo.findOne({ filter: { name } }))) {
      throw new ConflictException('Brand name alraedy exist');
    }

    const updated = await this.brandRepo.findOneAndUpdate({
      filter: { _id: brand._id },
      update: {
        ...(name ? { name } : undefined),
        ...(slogan ? { slogan } : undefined),
      },
      options: { new: true },
    });

    return updated;
  }

  async getAllBrands(query: QueryDto) {
    const { page, limit, search } = query;

    const data = await this.brandRepo.paginate({
      page,
      limit,
      search: {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { slogan: { $regex: search, $options: 'i' } },
        ],
      },
    });

    return data;
  }
}
