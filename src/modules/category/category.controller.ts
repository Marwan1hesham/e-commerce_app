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
import { FileInterceptor } from '@nestjs/platform-express';
import { multerCloud } from 'src/common/utils/multer.utils';
import { Auth } from 'src/common/decorators/auth.decorator';
import { RoleEnum } from 'src/common/enum/user.enum';
import { User } from 'src/common/decorators/user.decorator';
import type { HUserDoc } from 'src/DB/models/user.model';
import { createCategoryDto, IdDto, QueryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly CategoryService: CategoryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('attachment', multerCloud()))
  @Auth({ access_roles: [RoleEnum.admin] })
  createCategory(
    @Body() body: createCategoryDto,
    @UploadedFile(ParseFilePipe) file: Express.Multer.File,
    @User() user: HUserDoc,
  ) {
    return this.CategoryService.createCategory(body, file, user);
  }
}
