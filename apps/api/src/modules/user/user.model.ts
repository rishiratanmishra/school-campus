import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { INameModel } from '@api-base/common-schemas/index';
import { BaseModel } from '@api-base/base-classes/BaseModel';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users',
  },
})
export class IUser{
  @prop({ _id: false, type: () => INameModel })
  name?: INameModel;

  @prop({ required: true, unique: true, lowercase: true, type: String })
  email!: string;

  @prop({ required: true, minlength: 6, type: String })
  password!: string;

  @prop({ enum: UserRole, default: UserRole.USER, type: String })
  role?: UserRole;

  @prop({ default: true, type: Boolean })
  isActive!: boolean;
}

export const UserModel = getModelForClass(IUser);
