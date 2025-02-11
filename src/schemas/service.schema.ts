// src/experts/schemas/service.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  expertId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  duration: number; // in minutes
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
