import { NameModel } from '@api-base/common-schemas';
import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { IUser } from '../user/user.model';
import { BaseModel } from '@api-base/base-classes/BaseModel';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'students',
  },
})
export class IStudent extends BaseModel {
  @prop({ required: true, _id: false, type: () => NameModel })
  name: NameModel;

  @prop({ required: true, type: String })
  email: string;

  @prop({ required: true, type: Number })
  age: number;

  @prop({ ref: () => IUser })
  userProfileId?: Ref<IUser>;
}

export const StudentModel = getModelForClass(IStudent);
