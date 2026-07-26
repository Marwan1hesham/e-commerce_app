import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { Hash } from 'src/common/utils/security/hash';
import slugify from 'slugify';
import { User } from 'src/common/decorators/user.decorator';
import { Category } from './category.model';
import { Brand } from './brand.model';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class Product {
  @Prop({ type: String, required: true, trim: true, min: 3, unique: true })
  name: string;

  @Prop({
    type: String,
    default: function (this: Product) {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: Brand.name, required: true })
  brandId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, min: 3 })
  description: string;

  @Prop({ type: String, required: true })
  mainImage: string;

  @Prop({ type: [String] })
  subImages: string[];

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: Number })
  discount: number;

  @Prop({ type: Number, required: true })
  stock: number;

  @Prop({ type: Number })
  rateNum: number;

  @Prop({ type: Number })
  rateAvg: number;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const updated = this.getUpdate() as UpdateQuery<Product>;
  if (updated.name) {
    updated.slug = slugify(updated.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
});

export type HProductDoc = HydratedDocument<Product>;
export const ProductModel = MongooseModule.forFeature([
  { name: Product.name, schema: ProductSchema },
]);
