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

export class createBrandDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  slogan: string;
}

@AtLeastOne(['name', 'slogan'])
export class updateBrandDto extends PartialType(createBrandDto) {}

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
