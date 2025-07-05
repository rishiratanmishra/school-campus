import { prop, mongoose } from '@typegoose/typegoose';

export class RelUser {
  @prop({ required: true, type: mongoose.Types.ObjectId }) 
  _id!: mongoose.Types.ObjectId;

  @prop({ type: String })
  name?: string;
}

export class RelOrganisation {
  @prop({ required: true, type: mongoose.Types.ObjectId })
  _id!: mongoose.Types.ObjectId;

  @prop({ type: String })
  name?: string;
}

export class BaseModel {
  @prop({ _id: false, type: RelUser })
  createdBy?: RelUser;

  @prop({ _id: false, type: RelUser })
  updatedBy?: RelUser;

  @prop({ _id: false, type: RelOrganisation })
  organisation?: RelOrganisation;
}