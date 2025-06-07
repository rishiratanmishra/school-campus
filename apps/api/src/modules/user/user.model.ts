import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class INameModel {
  @prop({ required: true, trim: true, type: String })
  first!: string;

  @prop({ trim: true, type: String })
  middle?: string;

  @prop({ required: true, trim: true, type: String })
  last!: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'users',
  },
})
export class IUser {
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
