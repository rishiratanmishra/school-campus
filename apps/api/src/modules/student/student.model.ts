import { INameModel } from '@api-base/common-schemas';
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
    collection: 'students',
  },
})
export class IStudent {
  @prop({ required: true, _id: false, type: () => INameModel })
  name: INameModel;

  @prop({ required: true, type:String })
  email: string;

  @prop({ required: true, type:Number })
  age: number;

  @prop({ ref: () => IUser })
  userProfileId?: Ref<IUser>;
}

export const StudentModel = getModelForClass(IStudent);
