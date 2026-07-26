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
} from 'class-validator';
import { Types } from 'mongoose';
import { AtLeastOne } from 'src/common/decorators/brand.decorator';

export class createProductDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsString()
  @Length(3, 50000)
  description: string;

  @IsNotEmpty()
  @IsMongoId()
  brandId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  categoryId: Types.ObjectId;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  stock: number;

  @IsPositive()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discount: number;
}
