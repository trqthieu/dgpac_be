// src/notifications/schemas/notification.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', required: true })
  expertId: string;

  @Prop({ required: true })
  message: string;

  @Prop({ enum: ['unread', 'read'], default: 'unread' })
  status: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
