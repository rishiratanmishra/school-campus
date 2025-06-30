import { modelOptions, prop } from '@typegoose/typegoose';

export class INameModel {
  @prop({ required: true, trim: true, type: String })
  first!: string;

  @prop({ trim: true, type: String })
  middle?: string;

  @prop({ required: true, trim: true, type: String })
  last!: string;
}


@modelOptions({ schemaOptions: { _id: false } })
export class IGeoLocation {
  @prop({ required: true, type: Number })
  lat!: number;

  @prop({ required: true, type: Number })
  lng!: number;
}

@modelOptions({ schemaOptions: { _id: false } })
export class IAddress {
  @prop({ type: String, trim: true })
  addressLine1?: string;

  @prop({ type: String, trim: true })
  addressLine2?: string;

  @prop({ type: String, trim: true })
  city?: string;

  @prop({ type: String, trim: true })
  state?: string;

  @prop({ type: String, trim: true })
  country?: string;

  @prop({ type: String, trim: true })
  postalCode?: string;

  @prop({ required: false, type: () => IGeoLocation })
  geoLocation?: IGeoLocation;
}



export enum SubscriptionPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

export enum PaymentCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  BIANNUAL = 'BIANNUAL',
}

export interface ISocialMedia {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface IContactInfo {
  phone: string[];
  email: string[];
  website?: string;
  emergencyContact?: string;
}