import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { BoardType, OrganisationType } from './OrgEnums';
import { IAddress, ISocialMedia, IContactInfo } from '@api-base/common-schemas';
import { IUser } from '../user/user.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'organisations',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class IOrganisation {
  @prop({ required: true, type: String })
  name!: string;

  @prop({ required: false, unique: true, lowercase: true, type: String })
  slug?: string;

  @prop({ required: false, type: String })
  domain?: string;

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

  @prop({ required: false, type: () => [IAddress] })
  address?: IAddress[];

  @prop({ required: true, enum: BoardType, type: String })
  boardType!: BoardType;

  @prop({ required: false, type: Object })
  socialMedia?: ISocialMedia;

  @prop({ required: false, type: Object })
  contactInfo?: IContactInfo;

  @prop({ required: false, type: () => [IUser] })
  adminIds?: Ref<IUser>[];
}

export const OrganisationModel = getModelForClass(IOrganisation);
