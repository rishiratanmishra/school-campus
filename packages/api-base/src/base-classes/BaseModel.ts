import { prop, mongoose } from '@typegoose/typegoose';

class RelUser {
  @prop()
  name?: string;

  @prop()
  _id!: mongoose.Types.ObjectId;
}

class RelOrganisation {
  @prop()
  name?: string;

  @prop()
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
