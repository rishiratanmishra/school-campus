import { BaseModel } from '@api-base/base-classes/BaseModel';
import { IAddress } from '@api-base/common-schemas';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

export enum OrganisationType {
  SCHOOL = 'SCHOOL',
  COLLEGE = 'COLLEGE',
  UNIVERSITY = 'UNIVERSITY',
  TRAINING_INSTITUTE = 'TRAINING_INSTITUTE',
  COACHING = 'COACHING',
  OTHER = 'OTHER',
}

export enum BoardType {
  CBSE = 'CBSE',
  ICSE = 'ICSE',
  STATE = 'STATE',
  INTERNATIONAL = 'INTERNATIONAL',
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
    collection: 'organisations',
  },
})
export class IOrganisation {
  @prop({ required: true, type: String })
  name!: string;

  @prop({ required: false, unique: true, lowercase: true, type: String })
  slug: string;

  @prop({ type: String })
  domain?: string;

  @prop({ type: Date })
  established?: Date;

  @prop({ type: String })
  description?: string;

  @prop({ required: true, enum: OrganisationType, type: String })
  organisationType!: OrganisationType;

  @prop({ required: false, type: () => [IAddress] })
  address: IAddress[];

  @prop({ required: true, enum: BoardType, type: String })
  boardType!: BoardType;

  @prop({ default: true, type: Boolean })
  isActive!: boolean;
}

export const OrganisationModel = getModelForClass(IOrganisation);
