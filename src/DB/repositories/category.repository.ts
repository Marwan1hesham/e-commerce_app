import { Model } from 'mongoose';
import BaseRepository from './base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Category } from '../models/category.model';

@Injectable()
class CategoryRepository extends BaseRepository<Category> {
  constructor(@InjectModel(Category.name) protected model: Model<Category>) {
    super(model);
  }
}

export default CategoryRepository;
