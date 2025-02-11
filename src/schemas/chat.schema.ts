// src/chat/schemas/chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  // Reference to the user who sent the message
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'users', required: true })
  userId: string;

  @Prop({ required: true })
  message: string;

  // Sender can be 'user', 'expert', or 'system'
  @Prop({ required: true, enum: ['user', 'expert', 'system'], default: 'user' })
  sender: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
