import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { HUserDoc } from 'src/DB/models/user.model';
import { createProductDto } from './product.dto';
import { Request } from 'express';

@Controller('products')
export class ProductController {
  constructor(private readonly ProductService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'mainImage', maxCount: 1 },
        { name: 'subImages', maxCount: 5 },
      ],
      multerCloud(),
    ),
  )
  @Auth({ access_roles: [RoleEnum.admin] })
  createProduct(
    @Body() body: createProductDto,
    @UploadedFiles(ParseFilePipe)
    files: {
      mainImage: Express.Multer.File[];
      subImages: Express.Multer.File[];
    },
    @User() user: HUserDoc,
  ) {
    return this.ProductService.createProduct(body, files, user);
  }
}
