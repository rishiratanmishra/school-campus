import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import {  NameModel } from '@api-base/common-schemas/index';
import { BaseModel } from '@api-base/base-classes/BaseModel';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  MANAGER = 'MANAGER',
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users',
  },
})
export class IUser extends BaseModel {
  @prop({ _id: false, type: () => NameModel })
  name?: NameModel;

  @prop({ required: true, unique: true, lowercase: true, type: String })
  email!: string;

  @prop({ required: true, minlength: 6, type: String })
  password!: string;

  @prop({ enum: UserRole, default: UserRole.USER, type: String })
  role?: UserRole;

  @prop({ default: true, type: Boolean })
  isActive!: boolean;

  @prop({ default: false, type: Boolean })
  isDelete!: boolean;

  @prop({ type: String })
  refreshTokenHash?: string;
}

export const UserModel = getModelForClass(IUser);
