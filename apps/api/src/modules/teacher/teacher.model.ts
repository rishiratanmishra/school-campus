import { IAddress, INameModel } from '@api-base/common-schemas';
import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { IUser } from '../user/user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'teachers',
  },
})
export class ITeacher {
  @prop({ required: true, type: () => INameModel })
  name!: INameModel;

  @prop({ required: false, type: () => IAddress })
  address!: IAddress;

  @prop({ required: false, unique: true, lowercase: true, type: String })
  email!: string;

  @prop({ required: false, minlength: 6, type: String })
  password!: string;

  @prop({ ref: () => IUser })
  userProfileId?: Ref<IUser>;

  @prop({ default: true, type: Boolean })
  isActive!: boolean;
}

export const TeacherModel = getModelForClass(ITeacher);
