import { Address, NameModel } from '@api-base/common-schemas';
import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { IUser } from '../user/user.model';
import { IOrganisation } from '../organisation/organisation.model';
import { BaseModel } from '@api-base/base-classes/BaseModel';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'teachers',
  },
})
export class ITeacher extends BaseModel {
  @prop({ required: true, type: () => NameModel })
  name!: NameModel;

  @prop({ required: false, type: () => Address })
  address!: Address;

  @prop({ required: false, unique: true, lowercase: true, type: String })
  email!: string;

  @prop({ required: false, minlength: 6, type: String })
  password!: string;

  @prop({ ref: () => IUser })
  userProfileId?: Ref<IUser>;

  @prop({ ref: () => IOrganisation })
  organisationId?: Ref<IOrganisation>;

  @prop({ default: true, type: Boolean })
  isActive!: boolean;
}

export const TeacherModel = getModelForClass(ITeacher);
