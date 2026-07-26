import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { Hash } from 'src/common/utils/security/hash';
import slugify from 'slugify';
import { User } from 'src/common/decorators/user.decorator';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class Category {
  @Prop({ type: String, required: true, trim: true, min: 3, unique: true })
  name: string;

  @Prop({
    type: String,
    default: function (this: Category) {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({ type: String, required: true })
  image: string;

  @Prop([{ type: Types.ObjectId, ref: User.name }])
  brands: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const updated = this.getUpdate() as UpdateQuery<Category>;
  if (updated.name) {
    updated.slug = slugify(updated.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
});

export type HCategoryDoc = HydratedDocument<Category>;
export const CategoryModel = MongooseModule.forFeature([
  { name: Category.name, schema: CategorySchema },
]);
