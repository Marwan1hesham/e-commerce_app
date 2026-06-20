import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { GenderEnum, RoleEnum } from 'src/common/enum/user.enum';
import { Hash } from 'src/common/utils/security/hash';

@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  strictQuery: true,
})
export class User {
  @Prop({ type: String, required: true, trim: true })
  userName: string;

  @Prop({ type: String, required: true, unique: true, trim: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop(Number)
  age: number;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop(String)
  address: string;

  @Prop(String)
  proficePic: string;

  @Prop({ type: String, enum: GenderEnum, default: GenderEnum.male })
  gender: string;

  @Prop({ type: String, enum: RoleEnum, default: RoleEnum.user })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', function () {
  if (this.isModified('password')) {
    this.password = Hash({ plainText: this.password });
  }
});
export type HUserDoc = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
