import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { Types } from 'mongoose';
import { AtLeastOne } from 'src/common/decorators/brand.decorator';
import { ValidateIds } from 'src/common/decorators/category.decorator';

export class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @Validate(ValidateIds)
  @IsOptional()
  brands: Types.ObjectId[];
}

@AtLeastOne(['name', 'slogan'])
export class updateCategoryDto extends PartialType(createCategoryDto) {}

export class IdDto {
  @IsMongoId()
  id: Types.ObjectId;
}

export class QueryDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  search: string;
}
