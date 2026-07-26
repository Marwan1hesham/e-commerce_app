import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { HUserDoc } from 'src/DB/models/user.model';
import { createBrandDto, IdDto, QueryDto, updateBrandDto } from './brand.dto';

@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  @Auth({ access_roles: [RoleEnum.admin] })
  createBrand(
    @Body() body: createBrandDto,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    @User() user: HUserDoc,
  ) {
    return this.brandService.createBrand(body, file, user);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  @Auth({ access_roles: [RoleEnum.admin] })
  updateBrand(
    @Param() params: IdDto,
    @Body() body: updateBrandDto,
    @User() user: HUserDoc,
  ) {
    return this.brandService.updateBrand(body, params.id, user);
  }

  @Get()
  getAllBrands(@Query() query: QueryDto) {
    return this.brandService.getAllBrands(query);
  }
}
