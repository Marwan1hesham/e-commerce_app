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
export class Brand {
  @Prop({ type: String, required: true, trim: true, min: 3, unique: true })
  name: string;

  @Prop({
    type: String,
    default: function (this: Brand) {
      return slugify(this.name, { replacement: '-', lower: true, trim: true });
    },
  })
  slug: string;

  @Prop({ type: String, required: true })
  logo: string;

  @Prop({ type: String, required: true })
  slogan: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  updatedBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name })
  deletedBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

BrandSchema.pre(['findOneAndUpdate', 'updateOne'], function () {
  const updated = this.getUpdate() as UpdateQuery<Brand>;
  if (updated.name) {
    updated.slug = slugify(updated.name, {
      replacement: '-',
      lower: true,
      trim: true,
    });
  }
});

export type HBrandDoc = HydratedDocument<Brand>;
export const BrandModel = MongooseModule.forFeature([
  { name: Brand.name, schema: BrandSchema },
]);
