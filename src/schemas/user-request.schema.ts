import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRequestDocument = UserRequest & Document;

@Schema({ timestamps: true })
export class UserRequest {
  @Prop()
  name: string;

  @Prop()
  companyName: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  location: string;

  @Prop()
  request: string;

  @Prop()
  safetyDataSheet: string;

  @Prop()
  packingList: string;
}

export const UserRequestSchema = SchemaFactory.createForClass(UserRequest);
