import { prop, mongoose } from '@typegoose/typegoose';

export class RelUser {
  @prop({ type: String }) 
  name?: string;

  @prop({ required: true, type: mongoose.Types.ObjectId }) 
  _id!: mongoose.Types.ObjectId;
}

export class RelOrganisation {
  @prop({ type: String }) 
  name?: string;

  @prop({ required: true, type: mongoose.Types.ObjectId })
  _id!: mongoose.Types.ObjectId;
}

export class BaseModel {
  @prop({ _id: false, type: () => RelUser })
  createdBy?: RelUser;

  @prop({ _id: false, type: () => RelUser })
  updatedBy?: RelUser;

  @prop({ _id: false, type: () => RelOrganisation })
  organisation?: RelOrganisation;
}
