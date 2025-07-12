import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { BoardType, OrganisationType } from './OrgEnums';
import { ISocialMedia } from '@api-base/common-schemas';
import { IUser } from '../user/user.model';
import { BaseModel } from '@api-base/base-classes/BaseModel';

export enum ContactType {
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  FAX = 'FAX',
  MOBILE = 'MOBILE',
  LANDLINE = 'LANDLINE',
}

export enum AddressType {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH',
  BILLING = 'BILLING',
  POSTAL = 'POSTAL',
}

export class ContactInfo {
  @prop({ required: true, enum: ContactType, type: String })
  type!: ContactType;

  @prop({ required: false, type: String })
  label?: string;

  @prop({ required: true, type: String })
  value!: string;

  @prop({ required: false, type: String })
  extension?: string;

  @prop({ required: false, type: Boolean, default: false })
  isPrimary?: boolean;

  @prop({ required: false, type: Boolean, default: true })
  isPublic?: boolean;
}

export class Address {
  @prop({ required: true, enum: AddressType, type: String, default: AddressType.MAIN })
  type!: AddressType;

  @prop({ required: false, type: String })
  street?: string;

  @prop({ required: false, type: String })
  area?: string;

  @prop({ required: false, type: String })
  city?: string;

  @prop({ required: false, type: String })
  state?: string;

  @prop({ required: false, type: String })
  pincode?: string;

  @prop({ required: false, type: String })
  country?: string;

  @prop({ required: false, type: Boolean, default: false })
  isPrimary?: boolean;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'organisations',
  },
})
export class IOrganisation extends BaseModel {
  @prop({ required: true, type: String })
  name!: string;

  @prop({ required: false, type: String })
  domain?: string;

  @prop({ required: true, type: String })
  slug!: string;

  @prop({ required: false, type: String })
  logo?: string;

  @prop({ required: false, type: String })
  coverImage?: string;

  @prop({ required: false, type: Date })
  established?: Date;

  @prop({ required: false, type: String })
  motto?: string;

  @prop({ required: false, type: String })
  description?: string;

  @prop({ required: true, enum: OrganisationType, type: String })
  organisationType!: OrganisationType;

  @prop({ required: false, type: () => [Address] })
  address?: Address[];

  @prop({ required: true, enum: BoardType, type: String })
  boardType!: BoardType;

  @prop({ required: false, type: Object })
  socialMedia?: ISocialMedia;

  @prop({ required: false, type: () => [ContactInfo] })
  contactInfo?: ContactInfo[];

  @prop({ required: false, type: Boolean, default: false })
  isActive?: boolean;

  // @prop({ required: false, type: () => [IUser] })
  // adminIds?: Ref<IUser>[];
}

export const OrganisationModel = getModelForClass(IOrganisation);